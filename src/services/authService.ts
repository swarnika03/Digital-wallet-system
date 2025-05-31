import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import apiClient from './apiClient';
import { User } from '../types';
import { sendEmail } from './emailService';

// Mock implementation for demo purposes
// In a real app, these would make actual API calls

// Simulate login
export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  // In a real app, we'd use the apiClient here:
  // return apiClient.post('/auth/login', { email, password });

  // For demo, we'll simulate this with localStorage
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const user = users.find((u: any) => u.email === email);

  // Simulate 1 second API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password using bcrypt
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const { password: _, deleted, ...userWithoutPassword } = user;
  
  // Create a JWT-like token (not a real JWT for the demo)
  const token = `mock-jwt-${uuidv4()}`;
  
  return {
    token,
    user: {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      createdAt: userWithoutPassword.createdAt
    }
  };
};

// Simulate registration
export const register = async (
  name: string, 
  email: string, 
  password: string
): Promise<{ token: string; user: User }> => {
  // In a real app, we'd use the apiClient here:
  // return apiClient.post('/auth/register', { name, email, password });

  // For demo, we'll simulate this with localStorage
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  
  // Check if email is already used
  if (users.some((u: any) => u.email === email && !u.deleted)) {
    throw new Error('Email already in use');
  }

  // Simulate 1 second API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: 'user',
    balance: 0,
    createdAt: new Date().toISOString(),
    deleted: false
  };

  // Save to "database"
  users.push(newUser);
  localStorage.setItem('walletwise_users', JSON.stringify(users));

  // Send welcome email
  await sendEmail({
    to: email,
    subject: 'Welcome to WalletWise!',
    body: `Hi ${name},\n\nWelcome to WalletWise! Your account has been successfully created.`
  });

  const { password: _, deleted, ...userWithoutPassword } = newUser;
  
  // Create a JWT-like token (not a real JWT for the demo)
  const token = `mock-jwt-${uuidv4()}`;
  
  return {
    token,
    user: {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      createdAt: userWithoutPassword.createdAt
    }
  };
};

// Soft delete user account
export const deleteAccount = async (userId: string): Promise<void> => {
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex === -1) throw new Error('User not found');
  
  // Soft delete the user
  users[userIndex].deleted = true;
  users[userIndex].deletedAt = new Date().toISOString();
  
  localStorage.setItem('walletwise_users', JSON.stringify(users));
};