import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineClipboardCopy,
  HiOutlineExternalLink,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDownload,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineCursorClick,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

/**
 * URL card component displaying link details and action buttons
 */
const UrlCard = ({ url, onEdit, onDelete, baseUrl = import.meta.env.VITE_BASE_URL }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const shortUrl = `${baseUrl}/${url.customAlias || url.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownloadQr = () => {
    if (!url.qrCode) return;
    const link = document.createElement('a');
    link.download = `qr-${url.shortCode}.png`;
    link.href = url.qrCode;
    link.click();
    toast.success('QR code downloaded!');
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* QR Code */}
        <div
          className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-surface-200 dark:border-surface-600 cursor-pointer shrink-0 self-start"
          onClick={() => setShowQr(!showQr)}
        >
          {url.qrCode ? (
            <img
              src={url.qrCode}
              alt="QR Code"
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-surface-400 text-xs">
              No QR
            </div>
          )}
        </div>

        {/* URL Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline text-sm"
            >
              {shortUrl}
            </a>
            {url.customAlias && (
              <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full font-medium">
                Custom
              </span>
            )}
          </div>
          <p className="text-surface-500 dark:text-surface-400 text-sm truncate max-w-lg">
            {url.originalUrl}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <HiOutlineClock className="w-3.5 h-3.5" />
              {formatDate(url.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineCursorClick className="w-3.5 h-3.5" />
              {url.totalClicks} clicks
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-surface-500 hover:text-primary-600 dark:text-surface-400 transition-colors"
            title="Copy short URL"
          >
            {copied ? (
              <HiOutlineCheck className="w-5 h-5 text-emerald-500" />
            ) : (
              <HiOutlineClipboardCopy className="w-5 h-5" />
            )}
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-900/20 text-surface-500 hover:text-accent-600 dark:text-surface-400 transition-colors"
            title="Open link"
          >
            <HiOutlineExternalLink className="w-5 h-5" />
          </a>
          <button
            onClick={handleDownloadQr}
            className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-surface-500 hover:text-emerald-600 dark:text-surface-400 transition-colors"
            title="Download QR code"
          >
            <HiOutlineDownload className="w-5 h-5" />
          </button>
          <button
            onClick={() => onEdit(url)}
            className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-surface-500 hover:text-amber-600 dark:text-surface-400 transition-colors"
            title="Edit URL"
          >
            <HiOutlinePencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(url)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-surface-500 hover:text-red-600 dark:text-surface-400 transition-colors"
            title="Delete URL"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded QR Code */}
      {showQr && url.qrCode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700 flex justify-center"
        >
          <img
            src={url.qrCode}
            alt="QR Code"
            className="w-48 h-48 rounded-xl border border-surface-200 bg-white p-2"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default UrlCard;
