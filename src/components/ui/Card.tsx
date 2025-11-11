import React from "react";
import clsx from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    footer?: React.ReactNode;
    bordered?: boolean;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

// Main Card wrapper
export function Card({
                         title,
                         footer,
                         bordered = true,
                         className,
                         children,
                         ...props
                     }: CardProps) {
    return (
        <div
            className={clsx(
                "bg-white dark:bg-gray-800 rounded-xl shadow-sm transition hover:shadow-md",
                bordered && "border border-gray-200 dark:border-gray-700",
                className
            )}
            {...props}
        >
            {title && (
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
            )}

            {children}

            {footer && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                    {footer}
                </div>
            )}
        </div>
    );
}

// CardContent for consistent padding
export function CardContent({ className, children, ...props }: CardContentProps) {
    return (
        <div className={clsx("p-4 text-gray-800 dark:text-gray-100", className)} {...props}>
            {children}
        </div>
    );
}

export default Card;
