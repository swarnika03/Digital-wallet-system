import React from 'react';
import { CreditCard, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { motion } from 'framer-motion';

const BalanceCard: React.FC = () => {
  const { balance, loadingBalance } = useWallet();
  const [showBalance, setShowBalance] = React.useState(false);

  const toggleShowBalance = () => {
    setShowBalance(!showBalance);
  };

  const formatBalance = (bal: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(bal);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card overflow-hidden relative bg-gradient-to-br from-primary-400 to-primary-600 text-white"
    >
      <div className="absolute top-0 right-0 left-0 h-24 bg-white/10 backdrop-blur-xs"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <CreditCard size={24} className="mr-2" />
            <h2 className="text-lg font-semibold">Available Balance</h2>
          </div>
          <button 
            onClick={toggleShowBalance}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="mb-8">
          {loadingBalance ? (
            <div className="h-12 w-40 bg-white/20 rounded-md animate-pulse"></div>
          ) : (
            <h1 className="text-3xl font-bold">
              {showBalance ? formatBalance(balance) : '••••••••'}
            </h1>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center text-sm">
            <TrendingUp size={16} className="mr-1" />
            <span>Income</span>
          </div>
          <div className="flex items-center text-sm">
            <TrendingDown size={16} className="mr-1" />
            <span>Expenses</span>
          </div>
          <div className="flex items-center text-sm opacity-0">
            {/* Placeholder for flex alignment */}
            <span>Hidden</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BalanceCard;