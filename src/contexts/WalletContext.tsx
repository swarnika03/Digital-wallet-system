import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getBalance, 
  getTransactions, 
  deposit, 
  withdraw, 
  transfer 
} from '../services/walletService';
import { Transaction } from '../types';
import toast from 'react-hot-toast';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loadingBalance: boolean;
  loadingTransactions: boolean;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  depositFunds: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
  transferFunds: (recipientId: string, amount: number, note: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);

  const refreshBalance = async () => {
    if (!isAuthenticated) return;
    
    setLoadingBalance(true);
    try {
      const balance = await getBalance();
      setBalance(balance);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      toast.error("Failed to fetch your current balance");
    } finally {
      setLoadingBalance(false);
    }
  };

  const refreshTransactions = async () => {
    if (!isAuthenticated) return;
    
    setLoadingTransactions(true);
    try {
      const transactions = await getTransactions();
      setTransactions(transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Failed to fetch transaction history");
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshBalance();
      refreshTransactions();
    }
  }, [isAuthenticated, user?.id]);

  const depositFunds = async (amount: number) => {
    try {
      await deposit(amount);
      toast.success(`Successfully deposited $${amount.toFixed(2)}`);
      await refreshBalance();
      await refreshTransactions();
    } catch (error) {
      console.error("Deposit failed:", error);
      toast.error("Deposit failed. Please try again.");
      throw error;
    }
  };

  const withdrawFunds = async (amount: number) => {
    try {
      await withdraw(amount);
      toast.success(`Successfully withdrew $${amount.toFixed(2)}`);
      await refreshBalance();
      await refreshTransactions();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
      throw error;
    }
  };

  const transferFunds = async (recipientId: string, amount: number, note: string) => {
    try {
      await transfer(recipientId, amount, note);
      toast.success(`Successfully transferred $${amount.toFixed(2)}`);
      await refreshBalance();
      await refreshTransactions();
    } catch (error) {
      console.error("Transfer failed:", error);
      toast.error("Transfer failed. Please try again.");
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      loadingBalance,
      loadingTransactions,
      refreshBalance,
      refreshTransactions,
      depositFunds,
      withdrawFunds,
      transferFunds,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};