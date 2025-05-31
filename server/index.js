import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Secret (in a real app, this would be in an environment variable)
const JWT_SECRET = 'walletwise-secret-key';

// In-memory "database" - in a real app, this would be a real database
let users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    password: '$2a$10$uQFGx4DHUkWeNOEV4CwNuuAexHYsxz1qSK1IMCH7R/BW9MWsALiGW', // password123
    role: 'user',
    balance: 1000,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$10$EbE80tIBJKGCfJ.WL4eVH.KBtYZHXXPEUG5a8vVYXNYxGF8ckYKnm', // admin123
    role: 'admin',
    balance: 5000,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2a$10$uQFGx4DHUkWeNOEV4CwNuuAexHYsxz1qSK1IMCH7R/BW9MWsALiGW', // password123
    role: 'user',
    balance: 2500,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  }
];

let transactions = [
  {
    id: '101',
    userId: '1',
    type: 'deposit',
    amount: 500,
    balance: 500,
    status: 'completed',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '102',
    userId: '1',
    type: 'deposit',
    amount: 700,
    balance: 1200,
    status: 'completed',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '103',
    userId: '1',
    type: 'withdrawal',
    amount: 200,
    balance: 1000,
    status: 'completed',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin role required' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email);
  
  // In a real app, we would use bcrypt.compare
  if (!user || (password !== 'password123' && password !== 'admin123')) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Return user info and token (no password)
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, token });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if email already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  
  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password, // In a real app, we would hash the password with bcrypt
    role: 'user',
    balance: 0,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Create token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Return user info and token (no password)
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, token });
});

// Wallet Routes
app.get('/api/wallet/balance', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  res.json({ balance: user.balance });
});

app.get('/api/wallet/transactions', authenticateToken, (req, res) => {
  const userTransactions = transactions
    .filter(t => t.userId === req.user.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Add recipient names for transfers
  const enhancedTransactions = userTransactions.map(t => {
    if ((t.type === 'transfer_out' || t.type === 'transfer_in') && t.recipientId) {
      const otherUser = users.find(u => u.id === t.recipientId);
      if (otherUser) {
        return { ...t, recipientName: otherUser.name };
      }
    }
    return t;
  });
  
  res.json(enhancedTransactions);
});

app.post('/api/wallet/deposit', authenticateToken, (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  
  // Find user
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  
  // Check for fraud - multiple deposits in short time
  const recentDeposits = transactions.filter(
    t => t.userId === req.user.id && 
    t.type === 'deposit' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  const isSuspicious = recentDeposits.length >= 3 || amount > 2000;
  
  // Update balance
  const newBalance = users[userIndex].balance + Number(amount);
  users[userIndex].balance = newBalance;
  
  // Create transaction
  const transaction = {
    id: uuidv4(),
    userId: req.user.id,
    type: 'deposit',
    amount: Number(amount),
    balance: newBalance,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Unusual deposit pattern detected' : undefined
  };
  
  transactions.push(transaction);
  
  res.status(201).json(transaction);
});

app.post('/api/wallet/withdraw', authenticateToken, (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  
  // Find user
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
  
  // Check if user has enough balance
  if (users[userIndex].balance < Number(amount)) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  
  // Check for fraud - multiple withdrawals or large amount
  const recentWithdrawals = transactions.filter(
    t => t.userId === req.user.id && 
    t.type === 'withdrawal' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  const totalWithdrawn = recentWithdrawals.reduce((sum, t) => sum + t.amount, 0);
  const isSuspicious = recentWithdrawals.length >= 3 || 
                       Number(amount) > 1000 || 
                       (totalWithdrawn + Number(amount)) > 2000;
  
  // Update balance
  const newBalance = users[userIndex].balance - Number(amount);
  users[userIndex].balance = newBalance;
  
  // Create transaction
  const transaction = {
    id: uuidv4(),
    userId: req.user.id,
    type: 'withdrawal',
    amount: Number(amount),
    balance: newBalance,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Suspicious withdrawal activity' : undefined
  };
  
  transactions.push(transaction);
  
  res.status(201).json(transaction);
});

app.post('/api/wallet/transfer', authenticateToken, (req, res) => {
  const { recipientId, amount, note } = req.body;
  
  if (!recipientId) {
    return res.status(400).json({ message: 'Recipient is required' });
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  
  if (recipientId === req.user.id) {
    return res.status(400).json({ message: 'Cannot transfer to yourself' });
  }
  
  // Find sender and recipient
  const senderIndex = users.findIndex(u => u.id === req.user.id);
  const recipientIndex = users.findIndex(u => u.id === recipientId);
  
  if (senderIndex === -1) return res.status(404).json({ message: 'Sender not found' });
  if (recipientIndex === -1) return res.status(404).json({ message: 'Recipient not found' });
  
  // Check if sender has enough balance
  if (users[senderIndex].balance < Number(amount)) {
    return res.status(400).json({ message: 'Insufficient funds' });
  }
  
  // Check for fraud - multiple transfers or large amount
  const recentTransfers = transactions.filter(
    t => t.userId === req.user.id && 
    t.type === 'transfer_out' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  const totalTransferred = recentTransfers.reduce((sum, t) => sum + t.amount, 0);
  const isSuspicious = recentTransfers.length >= 5 || 
                       Number(amount) > 1500 || 
                       (totalTransferred + Number(amount)) > 3000;
  
  // Update balances
  const senderNewBalance = users[senderIndex].balance - Number(amount);
  const recipientNewBalance = users[recipientIndex].balance + Number(amount);
  
  users[senderIndex].balance = senderNewBalance;
  users[recipientIndex].balance = recipientNewBalance;
  
  // Create transactions
  const outgoingTransaction = {
    id: uuidv4(),
    userId: req.user.id,
    recipientId,
    recipientName: users[recipientIndex].name,
    type: 'transfer_out',
    amount: Number(amount),
    balance: senderNewBalance,
    note,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Unusual transfer pattern' : undefined
  };
  
  const incomingTransaction = {
    id: uuidv4(),
    userId: recipientId,
    recipientId: req.user.id,
    recipientName: req.user.name,
    type: 'transfer_in',
    amount: Number(amount),
    balance: recipientNewBalance,
    note,
    status: 'completed',
    timestamp: new Date().toISOString()
  };
  
  transactions.push(outgoingTransaction, incomingTransaction);
  
  res.status(201).json(outgoingTransaction);
});

// User Routes
app.get('/api/users/search', authenticateToken, (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({ message: 'Search query must be at least 2 characters' });
  }
  
  // Find users (excluding current user)
  const filteredUsers = users
    .filter(u => u.id !== req.user.id)
    .filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.email.toLowerCase().includes(query.toLowerCase())
    )
    .map(({ id, name, email, role, createdAt }) => ({ id, name, email, role, createdAt }));
  
  res.json(filteredUsers);
});

// Admin Routes
app.get('/api/admin/flagged-transactions', authenticateToken, isAdmin, (req, res) => {
  const flaggedTransactions = transactions
    .filter(t => t.status === 'flagged')
    .map(t => {
      const user = users.find(u => u.id === t.userId);
      return {
        ...t,
        userEmail: user ? user.email : 'Unknown User'
      };
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json(flaggedTransactions);
});

app.get('/api/admin/user-stats', authenticateToken, isAdmin, (req, res) => {
  const userStats = users.map(user => {
    const userTransactions = transactions.filter(t => t.userId === user.id);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      totalTransactions: userTransactions.length,
      joinDate: user.createdAt
    };
  }).sort((a, b) => b.balance - a.balance);
  
  res.json(userStats);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express API
export default app;