import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome,
  HiOutlineLink,
  HiOutlineChartBar,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const navItems = [
  { path: '/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/urls', icon: HiOutlineLink, label: 'My URLs' },
  { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { path: '/profile', icon: HiOutlineUser, label: 'Profile' },
];

/**
 * Dashboard sidebar navigation
 * Desktop: fixed sidebar, Mobile: slide-out drawer
 */
const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-surface-200 dark:border-surface-700">
        <NavLink to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">SL</span>
          </div>
          <span className="text-lg font-bold gradient-text">SnipLink</span>
        </NavLink>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"
        >
          <HiOutlineX className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-surface-200 dark:border-surface-700 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
        >
          {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
