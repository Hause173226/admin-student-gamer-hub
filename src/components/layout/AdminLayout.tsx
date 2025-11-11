import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../../stores/AuthStore.ts';

export function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { isLoggedIn } = useAuthStore(); // Auth check
  const navigate = useNavigate();

  // 🔥 FIX: Auth guard – Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true }); // Silent redirect, no back button
    }
  }, [isLoggedIn, navigate]);

  // Theme init – unchanged, solid
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // 🔥 FIX: Accessibility – aria-label on toggle for screen readers
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} // Accessibility win
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header isDark={isDark} onToggleDark={toggleDarkMode} />
          <main className="flex-1 overflow-auto p-6">
            {/* 🔥 FIX: Fallback for Outlet loading/errors */}
            <Outlet fallback={<div className="text-center p-8">Loading page...</div>} />
          </main>
        </div>
      </div>
  );
}

export default AdminLayout; // Default export for easy import