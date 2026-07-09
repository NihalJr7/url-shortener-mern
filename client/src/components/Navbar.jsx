import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Landing page navigation bar
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-xl font-bold gradient-text">SnipLink</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              FAQ
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300 transition-colors"
            >
              {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300"
            >
              {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300"
            >
              {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900"
        >
          <div className="px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600">
              Features
            </a>
            <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600">
              How It Works
            </a>
            <a href="#faq" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-surface-600 dark:text-surface-300 hover:text-primary-600">
              FAQ
            </a>
            <div className="pt-3 border-t border-surface-200 dark:border-surface-700 space-y-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="block w-full px-4 py-2.5 text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="block w-full px-4 py-2.5 text-center text-sm font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 rounded-xl">
                    Login
                  </Link>
                  <Link to="/register" className="block w-full px-4 py-2.5 text-center bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
