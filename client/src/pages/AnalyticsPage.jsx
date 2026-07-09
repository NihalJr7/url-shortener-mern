import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineCursorClick,
  HiOutlineClock,
  HiOutlineCalendar,
} from 'react-icons/hi';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import toast from 'react-hot-toast';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import analyticsService from '../services/analyticsService.js';
import urlService from '../services/urlService.js';

const CHART_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

/**
 * Analytics page with daily/weekly/monthly charts and device/browser breakdowns
 */
const AnalyticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');

  // Fetch user's URLs for selector
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await urlService.getAll({ limit: 100, sort: '-createdAt' });
        setUrls(response.data);
        if (response.data.length > 0) {
          setSelectedUrlId(response.data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load URLs');
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  // Fetch analytics when URL changes
  useEffect(() => {
    if (!selectedUrlId) return;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      try {
        const response = await analyticsService.getUrlAnalytics(selectedUrlId);
        setAnalytics(response.data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedUrlId]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMonth = (dateStr) => {
    const [year, month] = dateStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48 animate-pulse" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-6">Analytics</h1>
        <EmptyState
          icon={HiOutlineCursorClick}
          title="No links to analyze"
          description="Create your first short link to start tracking analytics."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Detailed click performance for your links
          </p>
        </div>

        {/* URL Selector */}
        <select
          value={selectedUrlId}
          onChange={(e) => setSelectedUrlId(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 max-w-xs"
        >
          {urls.map((url) => (
            <option key={url._id} value={url._id}>
              {url.customAlias || url.shortCode} — {url.originalUrl.substring(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      {analyticsLoading ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
          <ChartSkeleton />
        </div>
      ) : analytics ? (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                  <HiOutlineCursorClick className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Total Clicks</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">
                    {analytics.url.totalClicks}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white">
                  <HiOutlineClock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Last Clicked</p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white">
                    {analytics.url.lastClicked
                      ? new Date(analytics.url.lastClicked).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                  <HiOutlineCalendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                  <p className="text-lg font-bold text-surface-900 dark:text-white">
                    {new Date(analytics.url.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Chart Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 shadow-card"
          >
            <div className="flex items-center gap-1 mb-6 bg-surface-100 dark:bg-surface-800 rounded-xl p-1 w-fit">
              {['daily', 'weekly', 'monthly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                {activeTab === 'daily' ? (
                  <BarChart data={analytics.dailyClicks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="_id" tickFormatter={formatDate} stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      labelFormatter={formatDate}
                    />
                    <Bar dataKey="clicks" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : activeTab === 'weekly' ? (
                  <LineChart data={analytics.weeklyClicks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} label={{ value: 'Week #', position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                ) : (
                  <BarChart data={analytics.monthlyClicks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="_id" tickFormatter={formatMonth} stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} labelFormatter={formatMonth} />
                    <Bar dataKey="clicks" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Device & Browser breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Device Stats */}
            {analytics.deviceStats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                  Devices
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceStats}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="_id"
                        label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {analytics.deviceStats.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* Browser Stats */}
            {analytics.browserStats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6 shadow-card"
              >
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                  Browsers
                </h3>
                <div className="space-y-3">
                  {analytics.browserStats.map(({ _id, count }, index) => {
                    const total = analytics.browserStats.reduce((sum, b) => sum + b.count, 0);
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={_id}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-surface-700 dark:text-surface-300 font-medium">{_id}</span>
                          <span className="text-surface-500">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AnalyticsPage;
