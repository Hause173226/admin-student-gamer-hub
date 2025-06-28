import { clsx } from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

interface TableBodyProps {
  children: React.ReactNode;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: TableRowProps) {
  return (
    <tr className={clsx('hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors', className)}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th className={clsx('px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider', className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100', className)}>
      {children}
    </td>
  );
}