import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
      <motion.span
          className={clsx(
              'inline-flex items-center font-medium rounded-full',
              variantClasses[variant],
              sizeClasses[size]
          )}
          whileHover={{ scale: 1.05 }} // Subtle scale on hover for feedback
          transition={{ type: 'spring', stiffness: 400 }}
          role="status" // Accessibility – semantic for labels like "Active: 21"
          aria-live="polite" // Reads changes to screen readers
      >
        {children}
      </motion.span>
  );
}

export default Badge;