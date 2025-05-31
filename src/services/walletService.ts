import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types';

// Helper to get current user ID from JWT
const getCurrentUserId = (): string => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  // For demo purposes, we're using a simple user ID extraction
  // In a real app, this would decode the JWT
  return JSON.parse(localStorage.getItem('walletwise_users') || '[]')[0].id;
};

// Get current user's balance
export const getBalance = async (): Promise<number> => {
  const userId = getCurrentUserId();
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const currentUser = users.find((u: any) => u.id === userId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!currentUser) throw new Error('User not found');
  
  return currentUser.balance;
};

// Get user's transaction history
export const getTransactions = async (): Promise<Transaction[]> => {
  const userId = getCurrentUserId();
  const allTransactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter transactions for current user
  const userTransactions = allTransactions.filter((t: any) => t.userId === userId);
  
  // Add recipient names for transfers
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  
  return userTransactions.map((t: any) => {
    if (t.type === 'transfer_out' && t.recipientId) {
      const recipient = users.find((u: any) => u.id === t.recipientId);
      if (recipient) {
        t.recipientName = recipient.name;
      }
    } else if (t.type === 'transfer_in' && t.recipientId) {
      const sender = users.find((u: any) => u.id === t.recipientId);
      if (sender) {
        t.recipientName = sender.name;
      }
    }
    return t;
  }).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Deposit funds
export const deposit = async (amount: number): Promise<void> => {
  if (amount <= 0) throw new Error('Amount must be positive');
  
  const userId = getCurrentUserId();
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const transactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Find user and update balance
  const userIndex = users.findIndex((u: any) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  // Check for fraud: Unusual deposit patterns
  const userTransactions = transactions.filter((t: any) => 
    t.userId === userId && 
    t.type === 'deposit' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
  );
  
  const isSuspicious = userTransactions.length >= 3 || amount > 2000;
  const newBalance = users[userIndex].balance + amount;
  users[userIndex].balance = newBalance;
  
  // Create transaction record
  const transaction: Transaction = {
    id: uuidv4(),
    userId,
    type: 'deposit',
    amount,
    balance: newBalance,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Unusual deposit pattern detected' : undefined
  };
  
  transactions.push(transaction);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update "database"
  localStorage.setItem('walletwise_users', JSON.stringify(users));
  localStorage.setItem('walletwise_transactions', JSON.stringify(transactions));
};

// Withdraw funds
export const withdraw = async (amount: number): Promise<void> => {
  if (amount <= 0) throw new Error('Amount must be positive');
  
  const userId = getCurrentUserId();
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const transactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Find user
  const userIndex = users.findIndex((u: any) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  // Check if user has enough funds
  if (users[userIndex].balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Check for fraud: Large withdrawal or multiple withdrawals in short time
  const userTransactions = transactions.filter((t: any) => 
    t.userId === userId && 
    t.type === 'withdrawal' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
  );
  
  const totalWithdrawn = userTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  const isSuspicious = userTransactions.length >= 3 || 
                       amount > 1000 || 
                       (totalWithdrawn + amount) > 2000;
  
  const newBalance = users[userIndex].balance - amount;
  users[userIndex].balance = newBalance;
  
  // Create transaction record
  const transaction: Transaction = {
    id: uuidv4(),
    userId,
    type: 'withdrawal',
    amount,
    balance: newBalance,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Suspicious withdrawal activity' : undefined
  };
  
  transactions.push(transaction);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update "database"
  localStorage.setItem('walletwise_users', JSON.stringify(users));
  localStorage.setItem('walletwise_transactions', JSON.stringify(transactions));
};

// Transfer funds to another user
export const transfer = async (recipientId: string, amount: number, note: string): Promise<void> => {
  if (amount <= 0) throw new Error('Amount must be positive');
  if (!recipientId) throw new Error('Recipient is required');
  
  const senderId = getCurrentUserId();
  if (senderId === recipientId) throw new Error('Cannot transfer to yourself');
  
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const transactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Find sender and recipient
  const senderIndex = users.findIndex((u: any) => u.id === senderId);
  const recipientIndex = users.findIndex((u: any) => u.id === recipientId);
  
  if (senderIndex === -1) throw new Error('Sender not found');
  if (recipientIndex === -1) throw new Error('Recipient not found');
  
  // Check if sender has enough funds
  if (users[senderIndex].balance < amount) {
    throw new Error('Insufficient funds');
  }
  
  // Check for fraud: Multiple transfers in short time or large amounts
  const senderTransfers = transactions.filter((t: any) => 
    t.userId === senderId && 
    t.type === 'transfer_out' && 
    new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
  );
  
  const totalTransferred = senderTransfers.reduce((sum: number, t: any) => sum + t.amount, 0);
  const isSuspicious = senderTransfers.length >= 5 || 
                       amount > 1500 || 
                       (totalTransferred + amount) > 3000;
  
  // Update balances
  const senderNewBalance = users[senderIndex].balance - amount;
  const recipientNewBalance = users[recipientIndex].balance + amount;
  
  users[senderIndex].balance = senderNewBalance;
  users[recipientIndex].balance = recipientNewBalance;
  
  // Create transaction records
  const outgoingTransaction: Transaction = {
    id: uuidv4(),
    userId: senderId,
    recipientId,
    recipientName: users[recipientIndex].name,
    type: 'transfer_out',
    amount,
    balance: senderNewBalance,
    note,
    status: isSuspicious ? 'flagged' : 'completed',
    timestamp: new Date().toISOString(),
    flagReason: isSuspicious ? 'Unusual transfer pattern' : undefined
  };
  
  const incomingTransaction: Transaction = {
    id: uuidv4(),
    userId: recipientId,
    recipientId: senderId,
    recipientName: users[senderIndex].name,
    type: 'transfer_in',
    amount,
    balance: recipientNewBalance,
    note,
    status: 'completed',
    timestamp: new Date().toISOString()
  };
  
  transactions.push(outgoingTransaction, incomingTransaction);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Update "database"
  localStorage.setItem('walletwise_users', JSON.stringify(users));
  localStorage.setItem('walletwise_transactions', JSON.stringify(transactions));
};