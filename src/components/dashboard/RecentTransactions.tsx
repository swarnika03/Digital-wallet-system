import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightCircle, ArrowLeftCircle, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { Transaction } from '../../types';
import { format } from 'date-fns';

const RecentTransactions: React.FC = () => {
  const { transactions, loadingTransactions } = useWallet();
  const navigate = useNavigate();
  
  const recentTransactions = transactions.slice(0, 5);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <Plus size={18} className="text-success-500" />;
      case 'withdrawal':
        return <Minus size={18} className="text-warning-500" />;
      case 'transfer_in':
        return <ArrowRightCircle size={18} className="text-primary-500" />;
      case 'transfer_out':
        return <ArrowLeftCircle size={18} className="text-neutral-500" />;
      default:
        return null;
    }
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const isPositive = ['deposit', 'transfer_in'].includes(transaction.type);
    const prefix = isPositive ? '+' : '-';
    const className = `font-medium ${isPositive ? 'text-success-600' : 'text-error-600'}`;
    
    return (
      <span className={className}>
        {prefix}${Math.abs(transaction.amount).toFixed(2)}
      </span>
    );
  };

  const getTransactionLabel = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'transfer_in':
        return `From ${transaction.recipientName || 'Unknown'}`;
      case 'transfer_out':
        return `To ${transaction.recipientName || 'Unknown'}`;
      default:
        return 'Transaction';
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'failed':
        return <span className="badge badge-error">Failed</span>;
      case 'flagged':
        return (
          <span className="badge badge-error flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            Flagged
          </span>
        );
      default:
        return null;
    }
  };

  const viewAllTransactions = () => {
    navigate('/transactions');
  };

  if (loadingTransactions) {
    return (
      <div className="card animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-neutral-200 rounded w-48"></div>
          <div className="h-6 bg-neutral-200 rounded w-24"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="transaction-item">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-neutral-200 rounded-full mr-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-32"></div>
                <div className="h-3 bg-neutral-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-4 bg-neutral-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="card text-center py-8">
        <h3 className="text-lg font-medium text-neutral-700 mb-2">No Transactions Yet</h3>
        <p className="text-neutral-500 mb-4">Start using your wallet to see your transaction history here.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Transactions</h2>
        <button 
          onClick={viewAllTransactions}
          className="text-sm text-primary-500 hover:text-primary-600"
        >
          View All
        </button>
      </div>
      
      {recentTransactions.map((transaction) => (
        <div key={transaction.id} className="transaction-item">
          <div className="flex items-center">
            <div className="p-2 bg-neutral-100 rounded-full mr-3">
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <p className="font-medium text-neutral-800">
                {getTransactionLabel(transaction)}
              </p>
              <p className="text-xs text-neutral-500">
                {format(new Date(transaction.timestamp), 'MMM dd, yyyy • h:mm a')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            {getTransactionAmount(transaction)}
            {transaction.status !== 'completed' && (
              <div className="mt-1">
                {getStatusBadge(transaction.status)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;