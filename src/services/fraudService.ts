import { Transaction } from '../types';
import { sendEmail } from './emailService';

interface FraudScanResult {
  flaggedTransactions: Transaction[];
  totalScanned: number;
}

// Fraud detection rules
const FRAUD_RULES = {
  TRANSFER: {
    MAX_COUNT_24H: 5,
    MAX_AMOUNT: 1500,
    MAX_TOTAL_24H: 3000
  },
  WITHDRAWAL: {
    MAX_COUNT_24H: 3,
    MAX_AMOUNT: 1000,
    MAX_TOTAL_24H: 2000
  },
  DEPOSIT: {
    MAX_COUNT_24H: 3,
    MAX_AMOUNT: 2000,
    MAX_TOTAL_24H: 5000
  }
};

// Check for suspicious activity
export const scanForFraud = async (): Promise<FraudScanResult> => {
  const transactions = JSON.parse(localStorage.getItem('walletwise_transactions') || '[]');
  const users = JSON.parse(localStorage.getItem('walletwise_users') || '[]');
  
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const flaggedTransactions: Transaction[] = [];
  
  // Group transactions by user
  const userTransactions = transactions.reduce((acc: any, t: Transaction) => {
    if (!acc[t.userId]) {
      acc[t.userId] = [];
    }
    acc[t.userId].push(t);
    return acc;
  }, {});
  
  // Scan each user's transactions
  for (const [userId, userTxs] of Object.entries(userTransactions)) {
    const recent = (userTxs as Transaction[]).filter(
      t => new Date(t.timestamp) > last24Hours
    );
    
    // Check transfer patterns
    const transfers = recent.filter(t => t.type === 'transfer_out');
    const totalTransferred = transfers.reduce((sum, t) => sum + t.amount, 0);
    
    if (
      transfers.length > FRAUD_RULES.TRANSFER.MAX_COUNT_24H ||
      transfers.some(t => t.amount > FRAUD_RULES.TRANSFER.MAX_AMOUNT) ||
      totalTransferred > FRAUD_RULES.TRANSFER.MAX_TOTAL_24H
    ) {
      flaggedTransactions.push(...transfers.filter(t => !t.flagReason));
    }
    
    // Check withdrawal patterns
    const withdrawals = recent.filter(t => t.type === 'withdrawal');
    const totalWithdrawn = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    
    if (
      withdrawals.length > FRAUD_RULES.WITHDRAWAL.MAX_COUNT_24H ||
      withdrawals.some(t => t.amount > FRAUD_RULES.WITHDRAWAL.MAX_AMOUNT) ||
      totalWithdrawn > FRAUD_RULES.WITHDRAWAL.MAX_TOTAL_24H
    ) {
      flaggedTransactions.push(...withdrawals.filter(t => !t.flagReason));
    }
    
    // Check deposit patterns
    const deposits = recent.filter(t => t.type === 'deposit');
    const totalDeposited = deposits.reduce((sum, t) => sum + t.amount, 0);
    
    if (
      deposits.length > FRAUD_RULES.DEPOSIT.MAX_COUNT_24H ||
      deposits.some(t => t.amount > FRAUD_RULES.DEPOSIT.MAX_AMOUNT) ||
      totalDeposited > FRAUD_RULES.DEPOSIT.MAX_TOTAL_24H
    ) {
      flaggedTransactions.push(...deposits.filter(t => !t.flagReason));
    }
  }
  
  // Update flagged transactions in storage
  if (flaggedTransactions.length > 0) {
    const updatedTransactions = transactions.map((t: Transaction) => {
      const flagged = flaggedTransactions.find(f => f.id === t.id);
      if (flagged) {
        return {
          ...t,
          status: 'flagged',
          flagReason: 'Suspicious activity detected in daily scan'
        };
      }
      return t;
    });
    
    localStorage.setItem('walletwise_transactions', JSON.stringify(updatedTransactions));
    
    // Send alerts to admins
    const admins = users.filter((u: any) => u.role === 'admin' && !u.deleted);
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: 'New Suspicious Transactions Detected',
        body: `${flaggedTransactions.length} new suspicious transactions have been detected in the last 24 hours. Please review them in the admin dashboard.`
      });
    }
  }
  
  return {
    flaggedTransactions,
    totalScanned: transactions.length
  };
};

// Schedule daily fraud scan
export const startFraudScanScheduler = () => {
  // In a real app, this would use a proper scheduler like node-cron
  // For demo purposes, we'll use setInterval
  setInterval(async () => {
    console.log('Running scheduled fraud scan...');
    const result = await scanForFraud();
    console.log(`Scan complete: ${result.flaggedTransactions.length} transactions flagged`);
  }, 24 * 60 * 60 * 1000); // Run every 24 hours
  
  // Run initial scan
  scanForFraud();
};