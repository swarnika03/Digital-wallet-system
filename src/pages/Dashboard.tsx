import React, { useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import BalanceCard from '../components/dashboard/BalanceCard';
import ActionButtons from '../components/dashboard/ActionButtons';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { CreditCard, TrendingUp, TrendingDown, Clock, Shield } from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { transactions } = useWallet();

  // Calculate simple stats
  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalTransfers = transactions
    .filter(t => t.type === 'transfer_out')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <MainLayout title={`Welcome, ${user?.name}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Balance and Actions Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <BalanceCard />
          <ActionButtons />
          
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card flex items-center">
              <div className="p-2 bg-success-100 rounded-full">
                <TrendingUp size={20} className="text-success-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-500">Total Deposits</p>
                <p className="text-lg font-semibold">${totalDeposits.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="p-2 bg-warning-100 rounded-full">
                <TrendingDown size={20} className="text-warning-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-500">Total Withdrawals</p>
                <p className="text-lg font-semibold">${totalWithdrawals.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="card flex items-center">
              <div className="p-2 bg-primary-100 rounded-full">
                <CreditCard size={20} className="text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-neutral-500">Total Transfers</p>
                <p className="text-lg font-semibold">${totalTransfers.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Features Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 border-l-4 border-primary-400">
              <div className="flex items-start">
                <div className="p-2 bg-primary-100 rounded-full">
                  <Clock size={20} className="text-primary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-semibold text-neutral-800">Instant Transfers</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Send money to other users instantly without any delay or fees
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-5 border-l-4 border-secondary-500">
              <div className="flex items-start">
                <div className="p-2 bg-secondary-100 rounded-full">
                  <Shield size={20} className="text-secondary-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-md font-semibold text-neutral-800">Fraud Protection</h3>
                  <p className="text-sm text-neutral-500 mt-1">
                    Advanced fraud detection to protect your transactions and balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Transactions Section */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <RecentTransactions />
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default Dashboard;