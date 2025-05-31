import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, MinusCircle, Send } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  const { depositFunds, withdrawFunds } = useWallet();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      await depositFunds(numAmount);
      setShowDepositModal(false);
      setAmount('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }
      
      await withdrawFunds(numAmount);
      setShowWithdrawModal(false);
      setAmount('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const ActionButton = ({ icon, label, onClick, color }: { 
    icon: React.ReactNode; 
    label: string; 
    onClick: () => void; 
    color: string;
  }) => (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${color} text-white transition-transform duration-200`}
    >
      {icon}
      <span className="mt-2 text-sm font-medium">{label}</span>
    </motion.button>
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <ActionButton
          icon={<PlusCircle size={32} />}
          label="Deposit"
          onClick={() => setShowDepositModal(true)}
          color="bg-success-500 hover:bg-success-600"
        />
        <ActionButton
          icon={<MinusCircle size={32} />}
          label="Withdraw"
          onClick={() => setShowWithdrawModal(true)}
          color="bg-warning-500 hover:bg-warning-600"
        />
        <ActionButton
          icon={<Send size={32} />}
          label="Send Money"
          onClick={() => handleNavigate('/send')}
          color="bg-primary-400 hover:bg-primary-500"
        />
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>
            <form onSubmit={handleDepositSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDepositModal(false);
                    setAmount('');
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Withdraw Funds</h2>
            <form onSubmit={handleWithdrawSubmit}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 mb-1">
                  Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setAmount('');
                  }}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;