import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react'; // For icon type

interface StatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; type: 'increase' | 'decrease' };
  icon?: LucideIcon; // Optional with fallback
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
};

export function StatCard({ title, value, change, icon: Icon, color = 'blue' }: StatCardProps) {
  return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
                <div className="flex items-center mt-2">
              <span className={clsx(
                  'text-sm font-medium',
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              )}>
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
                </div>
            )}
          </div>
          <div className={clsx('p-3 rounded-xl', colorClasses[color])}>
            {/* 🔥 FIX: Fallback if Icon undefined – gray placeholder, no crash */}
            {Icon ? <Icon className="w-6 h-6" /> : <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center" aria-label="No icon" />}
          </div>
        </div>
      </div>
  );
}

// 🔥 FIX: Default export – clean, no extra space
export default StatCard;