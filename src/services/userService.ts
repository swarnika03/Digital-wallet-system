import { User } from '../types';

// Search for users by name or email
export const searchUsers = async (query: string): Promise<User[]> => {
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter users by name or email containing the query (case-insensitive)
  const filteredUsers = users.filter((user: any) => 
    user.name.toLowerCase().includes(query.toLowerCase()) || 
    user.email.toLowerCase().includes(query.toLowerCase())
  );
  
  // Return only necessary user data (no passwords!)
  return filteredUsers.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
};

// Get user profile information
export const getUserProfile = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  
  // For demo purposes, just return the first user
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const firstUser = users[0];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!firstUser) throw new Error('User not found');
  
  // Return only necessary user data
  return {
    id: firstUser.id,
    name: firstUser.name,
    email: firstUser.email,
    role: firstUser.role,
    createdAt: firstUser.createdAt
  };
};