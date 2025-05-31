import { FlaggedTransaction, UserStats } from '../types';

// Get all flagged transactions
export const getFlaggedTransactions = async (): Promise<FlaggedTransaction[]> => {
  const allTransactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get all flagged transactions
  const flaggedTransactions = allTransactions.filter((t: any) => t.status === 'flagged');
  
  // Enhance with user information
  return flaggedTransactions.map((t: any) => {
    const user = users.find((u: any) => u.id === t.userId);
    return {
      ...t,
      userEmail: user ? user.email : 'Unknown User'
    };
  }).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get user statistics (for top users list)
export const getUserStats = async (): Promise<UserStats[]> => {
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const allTransactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate stats for each user
  const userStats = users.map((user: any) => {
    const userTransactions = allTransactions.filter((t: any) => t.userId === user.id);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      balance: user.balance,
      totalTransactions: userTransactions.length,
      joinDate: user.createdAt
    };
  });
  
  // Sort by balance (highest first)
  return userStats.sort((a: UserStats, b: UserStats) => b.balance - a.balance);
};

// Get system summary stats (total users, transactions, volume)
export const getSystemStats = async () => {
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const allTransactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const totalUsers = users.length;
  const totalTransactions = allTransactions.length;
  const totalVolume = allTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalBalance = users.reduce((sum: number, u: any) => sum + u.balance, 0);
  
  return {
    totalUsers,
    totalTransactions,
    totalVolume,
    totalBalance
  };
};