import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineLogout,
  HiOutlineCalendar,
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Profile page with user info, edit profile, change password, and logout
 */
const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const profileForm = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm();

  const handleProfileUpdate = async (data) => {
    setIsUpdating(true);
    try {
      await updateUser({ name: data.name, email: data.email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await updateUser({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      passwordForm.reset();
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 shadow-card"
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/25">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400">{user?.email}</p>
            <div className="flex items-center gap-1 text-xs text-surface-400 mt-1">
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              Joined {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                {...profileForm.register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'At least 2 characters' },
                })}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            {profileForm.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="email"
                {...profileForm.register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                })}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            {profileForm.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Save Changes
          </button>
        </form>
      </motion.div>

      {/* Password Change */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <HiOutlineLockClosed className="w-5 h-5" />
            Password
          </h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
            className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-700"
          >
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                {...passwordForm.register('currentPassword', { required: 'Required' })}
                className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                {...passwordForm.register('newPassword', {
                  required: 'Required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
                className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                {...passwordForm.register('confirmPassword', { required: 'Required' })}
                className="w-full px-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full py-2.5 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 rounded-xl font-medium text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isChangingPassword && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Update Password
            </button>
          </motion.form>
        )}

        {!showPasswordForm && (
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Use a strong password with at least 6 characters.
          </p>
        )}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
