import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Auth layout — centered card with gradient background
 * Used for Login, Register, Forgot Password pages
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-surface-700">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
