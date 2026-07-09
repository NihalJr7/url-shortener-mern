import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

/**
 * Forgot password page (UI only)
 * Backend integration for email service can be added later
 */
const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    // Simulate API call — replace with actual service when email provider is integrated
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setEmailSent(true);
    toast.success('If an account exists, a reset link has been sent.');
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-white font-bold">SL</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
          {emailSent
            ? 'Check your email for reset instructions'
            : "Enter your email and we'll send you a reset link"}
        </p>
      </div>

      {emailSent ? (
        /* Success State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <HiOutlineMail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
            If an account with that email exists, we&apos;ve sent password reset instructions.
            Please check your inbox and spam folder.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full pl-11 pr-4 py-2.5 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Send Reset Link'
            )}
          </motion.button>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default ForgotPasswordPage;
