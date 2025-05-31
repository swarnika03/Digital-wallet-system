import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Wallet, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Decorative with gradient and logo */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-400 to-primary-700 p-12 flex-col justify-center items-center text-white"
      >
        <Wallet size={64} />
        <h1 className="text-4xl font-bold mt-6 mb-2">WalletWise</h1>
        <p className="text-lg text-center max-w-md opacity-90">
          The smart digital wallet with integrated fraud detection and secure money management
        </p>
        
        <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-medium mb-1">Secure Transfers</h3>
            <p className="text-sm opacity-80">Send money securely to friends and family with ease</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-medium mb-1">Fraud Protection</h3>
            <p className="text-sm opacity-80">Advanced fraud detection to keep your money safe</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-medium mb-1">Real-time Updates</h3>
            <p className="text-sm opacity-80">Instant notifications for all account activities</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-medium mb-1">Easy Management</h3>
            <p className="text-sm opacity-80">Track spending and manage your finances efficiently</p>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-center mb-8 md:hidden">
            <Wallet size={48} className="text-primary-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Welcome back</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-neutral-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="input pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : 'Login'}
            </button>
            
            <p className="mt-4 text-center text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign up
              </Link>
            </p>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Demo credentials</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setEmail('user@example.com');
                  setPassword('password123');
                }}
                className="btn btn-outline text-xs"
              >
                User Account
              </button>
              <button 
                onClick={() => {
                  setEmail('admin@example.com');
                  setPassword('admin123');
                }}
                className="btn btn-outline text-xs"
              >
                Admin Account
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;