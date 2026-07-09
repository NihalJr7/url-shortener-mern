import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Custom 404 page with animated illustration
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-8xl sm:text-9xl font-extrabold gradient-text leading-none">
            404
          </h1>
        </motion.div>

        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all w-full sm:w-auto"
          >
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-medium text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors w-full sm:w-auto"
          >
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
