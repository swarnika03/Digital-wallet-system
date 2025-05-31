import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4"
    >
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-400">404</h1>
        <div className="h-2 w-24 bg-primary-400 mx-auto my-6 rounded-full"></div>
        <h2 className="text-2xl font-semibold mb-6 text-neutral-800">Page Not Found</h2>
        <p className="mb-8 text-neutral-600 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn btn-primary w-full sm:w-auto flex items-center justify-center">
            <Home size={18} className="mr-2" />
            Go to Dashboard
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn btn-outline w-full sm:w-auto flex items-center justify-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;