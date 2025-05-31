import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wallet, 
  Home, 
  Send, 
  History, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/send', icon: <Send size={20} />, label: 'Send Money' },
    { path: '/transactions', icon: <History size={20} />, label: 'Transactions' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  if (isAdmin) {
    navItems.push({ 
      path: '/admin', 
      icon: <ShieldAlert size={20} />, 
      label: 'Admin Panel' 
    });
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-neutral-200 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Wallet className="text-primary-400" size={28} />
          <h1 className="text-xl font-bold ml-2 text-neutral-900">WalletWise</h1>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-neutral-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={toggleMobileMenu}
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="bg-white h-full w-4/5 max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-200 flex items-center">
              <Wallet className="text-primary-400" size={28} />
              <h1 className="text-xl font-bold ml-2 text-neutral-900">WalletWise</h1>
            </div>
            <div className="py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-6 py-3 ${
                    location.pathname === item.path
                      ? 'bg-primary-50 text-primary-500 border-l-4 border-primary-500'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-6 py-3 text-neutral-600 hover:bg-neutral-50"
              >
                <span className="mr-3"><LogOut size={20} /></span>
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-neutral-200 z-10">
        <div className="flex items-center h-16 px-6 border-b border-neutral-200">
          <Wallet className="text-primary-400" size={28} />
          <h1 className="text-xl font-bold ml-2 text-neutral-900">WalletWise</h1>
        </div>
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <nav className="px-3 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 my-1 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 text-primary-600 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-lg font-semibold">{user?.name.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;