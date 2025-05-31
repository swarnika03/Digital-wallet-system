export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  recipientId?: string;
  recipientName?: string;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
  amount: number;
  balance: number;
  note?: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  timestamp: string;
  flagReason?: string;
}

export interface FlaggedTransaction extends Transaction {
  flagReason: string;
  userEmail: string;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalTransfersIn: number;
  totalTransfersOut: number;
}

export interface UserStats {
  id: string;
  name: string;
  email: string;
  balance: number;
  totalTransactions: number;
  joinDate: string;
}