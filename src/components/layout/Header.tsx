import { Menu } from "@headlessui/react";
import { Settings, LogOut, User } from "lucide-react";
import { clsx } from "clsx";
import { useAuthStore } from "../../stores/AuthStore";

export function Header() {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-end">
        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <img
                src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  admin@sgh.edu.vn
                </p>
              </div>
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "flex items-center w-full px-4 py-2 text-sm text-left",
                        active ? "bg-gray-100 dark:bg-gray-700" : "",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "flex items-center w-full px-4 py-2 text-sm text-left",
                        active ? "bg-gray-100 dark:bg-gray-700" : "",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                  )}
                </Menu.Item>
                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={clsx(
                        "flex items-center w-full px-4 py-2 text-sm text-left",
                        active ? "bg-gray-100 dark:bg-gray-700" : "",
                        "text-red-600 dark:text-red-400"
                      )}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </header>
  );
}
