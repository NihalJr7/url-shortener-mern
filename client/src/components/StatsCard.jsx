import { motion } from 'framer-motion';

/**
 * Stats card component with glassmorphism styling
 * Used on dashboard for key metrics
 */
const StatsCard = ({ icon, label, value, trend, trendUp, color = 'primary' }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-surface-900 dark:text-white">
            {value}
          </h3>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trendUp ? 'text-emerald-500' : 'text-red-500'
                }`}
              >
                {trendUp ? '↑' : '↓'} {trend}%
              </span>
              <span className="text-xs text-surface-400">vs last week</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white text-xl shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
