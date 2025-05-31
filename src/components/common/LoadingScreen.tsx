import React from 'react';
import { Wallet } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <div className="animate-pulse text-primary-400">
        <Wallet size={64} />
      </div>
      <h1 className="mt-4 text-xl font-semibold text-neutral-700">Loading WalletWise...</h1>
    </div>
  );
};

export default LoadingScreen;