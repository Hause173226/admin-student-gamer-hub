import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/AuthStore"; // Your auth store

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true }); // Silent redirect
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // Fallback for SSR/strict mode
  }

  return <>{children}</>; // Render kids if auth'd
}

// 🔥 FIX: Default export – Matches App.tsx import
export default ProtectedRoute;
