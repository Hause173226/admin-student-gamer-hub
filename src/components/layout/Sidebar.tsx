import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { clsx } from "clsx";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS } from "../../constants/navigation";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Student Gamer Hub
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          )}
          <button
            onClick={onToggle}
            className={clsx(
              "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
              isCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft
              className={clsx(
                "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {NAVIGATION_ITEMS.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems.has(item.name);
                const isSubItemActive = hasSubItems
                  ? item.subItems?.some((subItem) => location.pathname === subItem.href)
                  : false;
                const isActive = !hasSubItems && location.pathname === item.href;

                return (
                  <li key={item.name}>
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => !isCollapsed && toggleExpand(item.name)}
                          className={clsx(
                            "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                            isSubItemActive
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                            isCollapsed && "justify-center"
                          )}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <item.icon
                            className={clsx("w-5 h-5", !isCollapsed && "mr-3")}
                          />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.name}</span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </>
                          )}
                        </button>
                        {!isCollapsed && isExpanded && (
                          <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            {item.subItems?.map((subItem) => {
                              const isSubActive = location.pathname === subItem.href;
                              return (
                                <li key={subItem.name}>
                                  <Link
                                    to={subItem.href}
                                    className={clsx(
                                      "flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                                      isSubActive
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                    )}
                                  >
                                    <subItem.icon className="w-4 h-4 mr-2" />
                                    <span>{subItem.name}</span>
                                    {subItem.badge && (
                                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={clsx(
                          "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                          isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <item.icon
                          className={clsx("w-5 h-5", !isCollapsed && "mr-3")}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {/* {item.badge && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {item.badge}
                              </span>
                            )} */}
                          </>
                        )}
                        {isCollapsed && item.badge && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
