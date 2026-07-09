import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiOutlinePlus,
  HiOutlineLink,
  HiOutlineSortDescending,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import UrlCard from '../components/UrlCard.jsx';
import Modal from '../components/Modal.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { UrlCardSkeleton } from '../components/LoadingSkeleton.jsx';
import urlService from '../services/urlService.js';
import useDebounce from '../hooks/useDebounce.js';

const sortOptions = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-clicked', label: 'Most Clicked' },
  { value: 'least-clicked', label: 'Least Clicked' },
];

/**
 * My URLs page with CRUD operations, search, filters, and pagination
 */
const MyUrlsPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const createForm = useForm();
  const editForm = useForm();

  const fetchUrls = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await urlService.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        sort,
      });
      setUrls(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort]);

  useEffect(() => {
    fetchUrls(1);
  }, [fetchUrls]);

  // Create URL
  const handleCreate = async (data) => {
    setActionLoading(true);
    try {
      await urlService.create({
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
      });
      toast.success('URL created successfully!');
      setShowCreateModal(false);
      createForm.reset();
      fetchUrls(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create URL');
    } finally {
      setActionLoading(false);
    }
  };

  // Edit URL
  const handleEdit = (url) => {
    setSelectedUrl(url);
    editForm.setValue('originalUrl', url.originalUrl);
    editForm.setValue('customAlias', url.customAlias || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data) => {
    setActionLoading(true);
    try {
      await urlService.update(selectedUrl._id, {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
      });
      toast.success('URL updated successfully!');
      setShowEditModal(false);
      editForm.reset();
      fetchUrls(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update URL');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete URL
  const handleDelete = (url) => {
    setSelectedUrl(url);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await urlService.delete(selectedUrl._id);
      toast.success('URL deleted successfully!');
      setShowDeleteModal(false);
      fetchUrls(pagination.page);
    } catch (error) {
      toast.error('Failed to delete URL');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My URLs</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Manage all your shortened links ({pagination.total} total)
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all shrink-0"
        >
          <HiOutlinePlus className="w-5 h-5" />
          Create Link
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by URL, short code, or alias..."
          />
        </div>
        <div className="relative">
          <HiOutlineSortDescending className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer min-w-[160px]"
          >
            {sortOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* URL List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <UrlCardSkeleton key={i} />)}
        </div>
      ) : urls.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {urls.map((url) => (
              <UrlCard
                key={url._id}
                url={url}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <EmptyState
          icon={HiOutlineLink}
          title={search ? 'No results found' : 'No links yet'}
          description={
            search
              ? 'Try a different search term.'
              : 'Create your first short link to get started!'
          }
          actionLabel={search ? undefined : 'Create Link'}
          onAction={search ? undefined : () => setShowCreateModal(true)}
        />
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => fetchUrls(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-surface-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchUrls(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* ===== CREATE MODAL ===== */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); createForm.reset(); }}
        title="Create Short Link"
      >
        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Destination URL *
            </label>
            <input
              type="url"
              placeholder="https://example.com/very-long-url"
              {...createForm.register('originalUrl', {
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Must start with http:// or https://',
                },
              })}
              className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
            {createForm.formState.errors.originalUrl && (
              <p className="text-red-500 text-xs mt-1">
                {createForm.formState.errors.originalUrl.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Custom Alias (optional)
            </label>
            <input
              type="text"
              placeholder="my-brand"
              {...createForm.register('customAlias', {
                pattern: {
                  value: /^[a-zA-Z0-9_-]{3,30}$/,
                  message: '3-30 characters: letters, numbers, hyphens, underscores',
                },
              })}
              className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
            {createForm.formState.errors.customAlias && (
              <p className="text-red-500 text-xs mt-1">
                {createForm.formState.errors.customAlias.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowCreateModal(false); createForm.reset(); }}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== EDIT MODAL ===== */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); editForm.reset(); }}
        title="Edit Link"
      >
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Destination URL
            </label>
            <input
              type="url"
              {...editForm.register('originalUrl', {
                required: 'URL is required',
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Must start with http:// or https://',
                },
              })}
              className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
            {editForm.formState.errors.originalUrl && (
              <p className="text-red-500 text-xs mt-1">
                {editForm.formState.errors.originalUrl.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Custom Alias
            </label>
            <input
              type="text"
              {...editForm.register('customAlias', {
                pattern: {
                  value: /^$|^[a-zA-Z0-9_-]{3,30}$/,
                  message: '3-30 characters: letters, numbers, hyphens, underscores',
                },
              })}
              className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
            />
            {editForm.formState.errors.customAlias && (
              <p className="text-red-500 text-xs mt-1">
                {editForm.formState.errors.customAlias.message}
              </p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowEditModal(false); editForm.reset(); }}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== DELETE MODAL ===== */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Link"
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗑️</span>
          </div>
          <p className="text-surface-700 dark:text-surface-300 mb-1">
            Are you sure you want to delete this link?
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
            This will permanently remove the short URL and all click analytics.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={actionLoading}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {actionLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyUrlsPage;
