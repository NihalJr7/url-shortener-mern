/**
 * Loading skeleton components for various UI elements
 */

export const CardSkeleton = () => (
  <div className="glass rounded-2xl p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-24 mb-3" />
        <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-16" />
      </div>
      <div className="w-12 h-12 bg-surface-200 dark:bg-surface-700 rounded-xl" />
    </div>
  </div>
);

export const UrlCardSkeleton = () => (
  <div className="glass rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-surface-200 dark:bg-surface-700 rounded-xl shrink-0" />
      <div className="flex-1">
        <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-48 mb-2" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-72 mb-2" />
        <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-32" />
      </div>
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-9 h-9 bg-surface-200 dark:bg-surface-700 rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass rounded-2xl p-6 animate-pulse">
    <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-32 mb-6" />
    <div className="h-64 bg-surface-200 dark:bg-surface-700 rounded-xl" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="glass rounded-2xl p-6 animate-pulse">
    <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-40 mb-4" />
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-12 bg-surface-200 dark:bg-surface-700 rounded-lg" />
      ))}
    </div>
  </div>
);
