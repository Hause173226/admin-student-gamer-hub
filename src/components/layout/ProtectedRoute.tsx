import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore"; // Your auth store

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist?.hasHydrated?.() ?? true
  );

  useEffect(() => {
    if (useAuthStore.persist?.hasHydrated?.()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist?.onFinishHydration?.(() =>
      setHasHydrated(true)
    );
    return () => {
      unsub?.();
    };
  }, []);

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Fallback for SSR/strict mode
  }

  return <>{children}</>; // Render kids if auth'd
}

// 🔥 FIX: Default export – Matches App.tsx import
export default ProtectedRoute;
