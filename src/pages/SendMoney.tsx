import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import UserSearchInput from '../components/common/UserSearchInput';
import { useWallet } from '../contexts/WalletContext';
import { User } from '../types';
import { Send, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SendMoney: React.FC = () => {
  const { balance, transferFunds } = useWallet();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  const handleNextStep = () => {
    if (!selectedUser?.id) {
      toast.error('Please select a recipient');
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser?.id) {
      toast.error('Please select a recipient');
      return;
    }

    const transferAmount = parseFloat(amount);
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    
    try {
      await transferFunds(selectedUser.id, transferAmount, note);
      toast.success(`Successfully sent $${transferAmount.toFixed(2)} to ${selectedUser.name}`);
      
      // Reset form
      setSelectedUser(null);
      setAmount('');
      setNote('');
      setStep(1);
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
    <MainLayout title="Send Money">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        <motion.div variants={itemVariants} className="card mb-6">
          <div className="flex items-center mb-6">
            <div className="p-3 rounded-full bg-primary-100">
              <Send size={24} className="text-primary-600" />
            </div>
            <h2 className="ml-3 text-xl font-semibold text-neutral-900">
              Transfer Funds
            </h2>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-neutral-700">Your Balance</p>
              <p className="text-lg font-semibold text-neutral-900">
                ${balance.toFixed(2)}
              </p>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-1.5">
              <div 
                className="bg-primary-400 h-1.5 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>

          {step === 1 ? (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Select Recipient
                </label>
                <UserSearchInput 
                  onUserSelect={handleUserSelect}
                  selectedUser={selectedUser}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={18} className="text-neutral-400" />
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="input pl-10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="note" className="block text-sm font-medium text-neutral-700 mb-2">
                  Note (Optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  className="input resize-none"
                  placeholder="What's this transfer for?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="btn btn-outline"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                        <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span>Send Money</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Transfer tips */}
        <motion.div variants={itemVariants} className="card bg-neutral-50 border border-neutral-200">
          <h3 className="text-md font-semibold text-neutral-800 mb-4">Transfer Tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-success-100 flex items-center justify-center mr-2">
                <span className="text-success-600 text-xs">✓</span>
              </span>
              <p className="text-sm text-neutral-600">Double-check recipient information before sending</p>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-success-100 flex items-center justify-center mr-2">
                <span className="text-success-600 text-xs">✓</span>
              </span>
              <p className="text-sm text-neutral-600">Transfers are instant and cannot be reversed</p>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-success-100 flex items-center justify-center mr-2">
                <span className="text-success-600 text-xs">✓</span>
              </span>
              <p className="text-sm text-neutral-600">Always add a note to remember what the transfer was for</p>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-success-100 flex items-center justify-center mr-2">
                <span className="text-success-600 text-xs">✓</span>
              </span>
              <p className="text-sm text-neutral-600">Multiple large transfers may be flagged for security</p>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
};

export default SendMoney;