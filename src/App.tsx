import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";

// Default imports – no braces (fix for TS2305)
import AdminLayout from "./components/layout/AdminLayout";
import Login from "./pages/Login"; // Assumes default export in Login.tsx
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Lazy load all pages for perf – consistent bundle splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const GameRooms = lazy(() => import("./pages/GameRooms"));
const Events = lazy(() => import("./pages/Events"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Billing = lazy(() => import("./pages/Billing"));
const Transactions = lazy(() => import("./pages/Transactions"));
const MemberShipManagement = lazy(
  () => import("./pages/MembershipManagement.tsx")
);
const PaymentsManagement = lazy(() => import("./pages/PaymentsManagement"));
const Revenue = lazy(() => import("./pages/Revenue"));
const Community = lazy(() => import("./pages/CommunityManagement.tsx"));
const Club = lazy(() => import("./pages/ClubManagement.tsx"));
const Game = lazy(() => import("./pages/GameManagement.tsx"));
function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="rooms" element={<GameRooms />} />
            <Route path="events" element={<Events />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="billing" element={<Billing />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="revenue" element={<Revenue />} />
            <Route
              path="payments-management"
              element={<PaymentsManagement />}
            />
            <Route
              path="membership-management"
              element={<MemberShipManagement />}
            />
            <Route path="community-management" element={<Community />} />
            <Route path="club-management" element={<Club />} />
            <Route path="game-management" element={<Game />} />
            <Route
              path="analytics"
              element={
                <div className="p-8 text-center text-gray-500">
                  Analytics page coming soon...
                </div>
              }
            />
            <Route
              path="tournaments"
              element={
                <div className="p-8 text-center text-gray-500">
                  Tournaments page coming soon...
                </div>
              }
            />
            <Route
              path="reviews"
              element={
                <div className="p-8 text-center text-gray-500">
                  Reviews page coming soon...
                </div>
              }
            />
            <Route
              path="moderation"
              element={
                <div className="p-8 text-center text-gray-500">
                  Moderation page coming soon...
                </div>
              }
            />
            <Route
              path="notifications"
              element={
                <div className="p-8 text-center text-gray-500">
                  Notifications page coming soon...
                </div>
              }
            />
            <Route
              path="settings"
              element={
                <div className="p-8 text-center text-gray-500">
                  Settings page coming soon...
                </div>
              }
            />
          </Route>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
