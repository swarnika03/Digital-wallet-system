import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useWallet } from '../contexts/WalletContext';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { 
  Plus, 
  Minus, 
  ArrowRightCircle, 
  ArrowLeftCircle, 
  Search, 
  Filter,
  AlertTriangle,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

const Transactions: React.FC = () => {
  const { transactions, loadingTransactions } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search by recipient name or note
    const searchMatch = 
      (transaction.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) || 
      (transaction.note?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    // Filter by type
    const typeMatch = 
      typeFilter === 'all' || 
      (typeFilter === 'deposit' && transaction.type === 'deposit') ||
      (typeFilter === 'withdrawal' && transaction.type === 'withdrawal') ||
      (typeFilter === 'transfer_in' && transaction.type === 'transfer_in') ||
      (typeFilter === 'transfer_out' && transaction.type === 'transfer_out');
    
    // Filter by status
    const statusMatch = 
      statusFilter === 'all' || 
      transaction.status === statusFilter;
    
    return searchMatch && typeMatch && statusMatch;
  });

  return (
    <MainLayout title="Transaction History">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search by recipient or notes"
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <select
                className="input appearance-none pr-8"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer_in">Received</option>
                <option value="transfer_out">Sent</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <Filter size={16} />
              </div>
            </div>

            <div className="relative">
              <select
                className="input appearance-none pr-8"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="flagged">Flagged</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                <Filter size={16} />
              </div>
            </div>

            <button className="btn btn-outline flex items-center">
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            {loadingTransactions ? (
              <div className="animate-pulse p-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-neutral-100 mb-4 rounded-md"></div>
                ))}
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-neutral-700 mb-2">No Transactions Found</h3>
                <p className="text-neutral-500">
                  {transactions.length === 0 
                    ? "You haven't made any transactions yet." 
                    : "No transactions match your filters."}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="p-2 bg-neutral-100 rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-neutral-900">
                            {getTransactionLabel(transaction)}
                          </div>
                          {transaction.note && (
                            <div className="text-sm text-neutral-500 truncate max-w-xs">
                              {transaction.note}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500">
                          {format(new Date(transaction.timestamp), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {format(new Date(transaction.timestamp), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTransactionAmount(transaction)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(transaction.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Transactions;