import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import Sidebar from '../components/Sidebar.jsx';

/**
 * Dashboard layout — sidebar + main content area
 * Responsive: fixed sidebar on desktop, drawer on mobile
 */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar (mobile) */}
        <header className="sticky top-0 z-30 lg:hidden bg-white/80 dark:bg-surface-900/80 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-300"
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">SL</span>
              </div>
              <span className="text-base font-bold gradient-text">SnipLink</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
