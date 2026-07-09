import Url from '../models/Url.js';
import Click from '../models/Click.js';

/**
 * @desc    Get dashboard statistics for the authenticated user
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all URLs for this user
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.totalClicks, 0);
    const activeLinks = urls.filter((url) => url.isActive).length;
    const avgClicks = totalUrls > 0 ? Math.round(totalClicks / totalUrls) : 0;

    // Most popular link
    const mostPopular = urls.length
      ? urls.reduce((max, url) =>
          url.totalClicks > max.totalClicks ? url : max
        )
      : null;

    // Recent links (last 5)
    const recentLinks = urls.slice(0, 5);

    // Click trend — last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const urlIds = urls.map((u) => u._id);
    const clickTrend = await Click.aggregate([
      {
        $match: {
          urlId: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0 clicks
    const filledTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = clickTrend.find((c) => c._id === dateStr);
      filledTrend.push({
        date: dateStr,
        clicks: found ? found.clicks : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        totalUrls,
        totalClicks,
        activeLinks,
        avgClicks,
        mostPopular: mostPopular
          ? {
              _id: mostPopular._id,
              originalUrl: mostPopular.originalUrl,
              shortCode: mostPopular.shortCode,
              customAlias: mostPopular.customAlias,
              totalClicks: mostPopular.totalClicks,
            }
          : null,
        recentLinks,
        clickTrend: filledTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed analytics for a specific URL
 * @route   GET /api/analytics/url/:id
 * @access  Private
 */
export const getUrlAnalytics = async (req, res, next) => {
  try {
    const url = await Url.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      res.statusCode = 404;
      throw new Error('URL not found');
    }

    // Daily clicks — last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyClicks = await Click.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Weekly clicks — last 12 weeks
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

    const weeklyClicks = await Click.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: twelveWeeksAgo },
        },
      },
      {
        $group: {
          _id: { $isoWeek: '$timestamp' },
          clicks: { $sum: 1 },
          weekStart: { $min: '$timestamp' },
        },
      },
      { $sort: { weekStart: 1 } },
    ]);

    // Monthly clicks — last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyClicks = await Click.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$timestamp' },
          },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Device breakdown
    const deviceStats = await Click.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 },
        },
      },
    ]);

    // Browser breakdown
    const browserStats = await Click.aggregate([
      { $match: { urlId: url._id } },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        url: {
          _id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          customAlias: url.customAlias,
          totalClicks: url.totalClicks,
          lastClicked: url.lastClicked,
          createdAt: url.createdAt,
        },
        dailyClicks,
        weeklyClicks: weeklyClicks.map((w) => ({
          week: w._id,
          clicks: w.clicks,
          weekStart: w.weekStart,
        })),
        monthlyClicks,
        deviceStats,
        browserStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
