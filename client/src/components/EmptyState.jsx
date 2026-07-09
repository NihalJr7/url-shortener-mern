import { motion } from 'framer-motion';
import { HiOutlineLink } from 'react-icons/hi';

/**
 * Empty state component with icon, message, and optional CTA
 */
const EmptyState = ({
  icon: Icon = HiOutlineLink,
  title = 'No data found',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-surface-500 dark:text-surface-400 text-center max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
