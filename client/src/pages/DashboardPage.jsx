import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineLink,
  HiOutlineCursorClick,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineExternalLink,
} from 'react-icons/hi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';
import StatsCard from '../components/StatsCard.jsx';
import { CardSkeleton, ChartSkeleton, UrlCardSkeleton } from '../components/LoadingSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import analyticsService from '../services/analyticsService.js';
import urlService from '../services/urlService.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Dashboard page with statistics, click trend chart, quick shorten, and recent links
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickUrl, setQuickUrl] = useState('');
  const [shortening, setShortening] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsService.getDashboard();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickShorten = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setShortening(true);
    try {
      await urlService.create({ originalUrl: quickUrl });
      toast.success('URL shortened successfully!');
      setQuickUrl('');
      fetchDashboard(); // Refresh stats
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setShortening(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-64 animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <ChartSkeleton />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <UrlCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Here&apos;s what&apos;s happening with your links today.
        </p>
      </div>

      {/* Quick Shorten */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleQuickShorten}
        className="glass rounded-2xl p-4 shadow-card"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={quickUrl}
            onChange={(e) => setQuickUrl(e.target.value)}
            placeholder="Paste a long URL to shorten..."
            className="flex-1 px-4 py-2.5 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={shortening}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
          >
            {shortening ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineLightningBolt className="w-4 h-4" />
            )}
            Shorten
          </button>
        </div>
      </motion.form>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<HiOutlineLink className="w-6 h-6" />}
          label="Total Links"
          value={stats?.totalUrls || 0}
          color="primary"
        />
        <StatsCard
          icon={<HiOutlineCursorClick className="w-6 h-6" />}
          label="Total Clicks"
          value={stats?.totalClicks || 0}
          color="accent"
        />
        <StatsCard
          icon={<HiOutlineLightningBolt className="w-6 h-6" />}
          label="Active Links"
          value={stats?.activeLinks || 0}
          color="success"
        />
        <StatsCard
          icon={<HiOutlineTrendingUp className="w-6 h-6" />}
          label="Avg. Clicks"
          value={stats?.avgClicks || 0}
          color="warning"
        />
      </div>

      {/* Click Trend Chart */}
      {stats?.clickTrend?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 shadow-card"
        >
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
            Click Trend (Last 7 Days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.clickTrend}>
                <defs>
                  <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  stroke="#94a3b8"
                  fontSize={12}
                />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                  labelFormatter={formatDate}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#clickGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Most Popular Link */}
      {stats?.mostPopular && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 shadow-card"
        >
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-3">
            🏆 Most Popular Link
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                {stats.mostPopular.customAlias || stats.mostPopular.shortCode}
              </p>
              <p className="text-surface-500 dark:text-surface-400 text-xs truncate max-w-md mt-1">
                {stats.mostPopular.originalUrl}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {stats.mostPopular.totalClicks}
              </p>
              <p className="text-xs text-surface-500">clicks</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            Recent Links
          </h2>
          <Link
            to="/urls"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            View all <HiOutlineExternalLink className="w-4 h-4" />
          </Link>
        </div>

        {stats?.recentLinks?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentLinks.map((url) => (
              <motion.div
                key={url._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-primary-600 dark:text-primary-400 font-medium text-sm truncate">
                    {url.customAlias || url.shortCode}
                  </p>
                  <p className="text-surface-500 dark:text-surface-400 text-xs truncate mt-0.5">
                    {url.originalUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-surface-500 shrink-0">
                  <HiOutlineCursorClick className="w-4 h-4" />
                  {url.totalClicks}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No links yet"
            description="Create your first short link to get started!"
            actionLabel="Create Link"
            onAction={() => document.querySelector('input[type="url"]')?.focus()}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
