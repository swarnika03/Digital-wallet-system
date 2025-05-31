import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For demo purposes, we'll create a mock API using local storage
// In a real app, this would use the axios instance to make actual API calls

// Load mock data from localStorage or initialize if not present
const initializeMockData = () => {
  if (!localStorage.getItem('walletwise_users')) {
    localStorage.setItem('walletwise_users', JSON.stringify([
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
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: '$2a$10$uQFGx4DHUkWeNOEV4CwNuuAexHYsxz1qSK1IMCH7R/BW9MWsALiGW', // password123
        role: 'user',
        balance: 3200,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 days ago
      },
      {
        id: '5',
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: '$2a$10$uQFGx4DHUkWeNOEV4CwNuuAexHYsxz1qSK1IMCH7R/BW9MWsALiGW', // password123
        role: 'user',
        balance: 950,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    ]));

    localStorage.setItem('walletwise_transactions', JSON.stringify([
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
      },
      {
        id: '104',
        userId: '1',
        recipientId: '3',
        recipientName: 'John Doe',
        type: 'transfer_out',
        amount: 150,
        balance: 850,
        note: 'Lunch payment',
        status: 'completed',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '105',
        userId: '3',
        recipientId: '1',
        recipientName: 'Demo User',
        type: 'transfer_in',
        amount: 150,
        balance: 2350,
        note: 'Lunch payment',
        status: 'completed',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '106',
        userId: '1',
        type: 'withdrawal',
        amount: 600,
        balance: 250,
        status: 'flagged',
        flagReason: 'Suspicious large withdrawal',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '107',
        userId: '1',
        type: 'deposit',
        amount: 750,
        balance: 1000,
        status: 'completed',
        timestamp: new Date().toISOString()
      }
    ]));
  }
};

initializeMockData();

export default apiClient;