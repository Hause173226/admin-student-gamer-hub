import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { GameRooms } from './pages/GameRooms';
import { Events } from './pages/Events';
import { Feedback } from './pages/Feedback';
import { Billing } from './pages/Billing';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="rooms" element={<GameRooms />} />
          <Route path="events" element={<Events />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="billing" element={<Billing />} />
          <Route path="analytics" element={<div className="p-8 text-center text-gray-500">Analytics page coming soon...</div>} />
          <Route path="tournaments" element={<div className="p-8 text-center text-gray-500">Tournaments page coming soon...</div>} />
          <Route path="reviews" element={<div className="p-8 text-center text-gray-500">Reviews page coming soon...</div>} />
          <Route path="moderation" element={<div className="p-8 text-center text-gray-500">Moderation page coming soon...</div>} />
          <Route path="notifications" element={<div className="p-8 text-center text-gray-500">Notifications page coming soon...</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-gray-500">Settings page coming soon...</div>} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;