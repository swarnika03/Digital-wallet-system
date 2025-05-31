import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { ShieldAlert, Users, AlertTriangle, DollarSign, TrendingUp, Download } from 'lucide-react';
import { getFlaggedTransactions, getUserStats } from '../services/adminService';
import { FlaggedTransaction, UserStats } from '../types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [flaggedTransactions, setFlaggedTransactions] = useState<FlaggedTransaction[]>([]);
  const [topUsers, setTopUsers] = useState<UserStats[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState('flagged');

  useEffect(() => {
    fetchFlaggedTransactions();
    fetchUserStats();
  }, []);

  const fetchFlaggedTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const transactions = await getFlaggedTransactions();
      setFlaggedTransactions(transactions);
    } catch (error) {
      console.error('Error fetching flagged transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchUserStats = async () => {
    setLoadingUsers(true);
    try {
      const users = await getUserStats();
      setTopUsers(users);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <MainLayout title="Admin Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="card bg-error-50 border-l-4 border-error-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-error-100">
                <AlertTriangle size={24} className="text-error-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Flagged Transactions</h3>
                <p className="text-2xl font-bold text-error-600">{flaggedTransactions.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-primary-50 border-l-4 border-primary-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100">
                <Users size={24} className="text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Total Users</h3>
                <p className="text-2xl font-bold text-primary-600">{topUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="card bg-success-50 border-l-4 border-success-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100">
                <DollarSign size={24} className="text-success-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-neutral-500">Total Balance</h3>
                <p className="text-2xl font-bold text-success-600">
                  ${topUsers.reduce((sum, user) => sum + user.balance, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg border border-b-0 border-neutral-200">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'flagged'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('flagged')}
            >
              <div className="flex items-center">
                <ShieldAlert size={16} className="mr-2" />
                Flagged Transactions
              </div>
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <div className="flex items-center">
                <TrendingUp size={16} className="mr-2" />
                Top Users
              </div>
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="bg-white rounded-b-lg border border-neutral-200 overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-neutral-200">
            <h3 className="text-lg font-medium text-neutral-800">
              {activeTab === 'flagged' ? 'Suspicious Activity' : 'User Rankings'}
            </h3>
            <button className="btn btn-outline flex items-center text-sm">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>

          {/* Flagged Transactions Table */}
          {activeTab === 'flagged' && (
            <div className="overflow-x-auto">
              {loadingTransactions ? (
                <div className="animate-pulse p-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-neutral-100 mb-4 rounded-md"></div>
                  ))}
                </div>
              ) : flaggedTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-neutral-700 mb-2">No Flagged Transactions</h3>
                  <p className="text-neutral-500">
                    All transactions appear to be normal.
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Flag Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {flaggedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-neutral-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-neutral-600">
                                {transaction.userEmail.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-neutral-900">{transaction.userEmail}</div>
                              <div className="text-xs text-neutral-500">User ID: {transaction.userId.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-800">
                            {transaction.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-error-600">
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {format(new Date(transaction.timestamp), 'MMM dd, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AlertTriangle size={16} className="text-error-500 mr-1" />
                            <span className="text-sm text-error-600">{transaction.flagReason}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded hover:bg-success-200 transition-colors">
                              Approve
                            </button>
                            <button className="text-xs px-2 py-1 bg-error-100 text-error-700 rounded hover:bg-error-200 transition-colors">
                              Block
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Top Users Table */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="animate-pulse p-8">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-neutral-100 mb-4 rounded-md"></div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Transactions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {topUsers.map((user, index) => (
                      <tr key={user.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center font-medium text-sm ${
                            index < 3 
                              ? 'bg-accent-100 text-accent-800' 
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                              <div className="text-xs text-neutral-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">${user.balance.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500">{user.totalTransactions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                          {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default AdminDashboard;