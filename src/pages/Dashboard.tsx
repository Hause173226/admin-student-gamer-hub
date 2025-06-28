import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Users, Gamepad2, Calendar, DollarSign, TrendingUp, Clock, Trophy, MessageSquare } from 'lucide-react';
import { MOCK_DASHBOARD_STATS, MOCK_CHART_DATA, MOCK_EVENTS, MOCK_ROOMS } from '../constants/mockData';

export function Dashboard() {
  const stats = MOCK_DASHBOARD_STATS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Chào mừng bạn trở lại! Đây là tổng quan về hoạt động của hệ thống.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Xuất báo cáo</Button>
          <Button>Tạo sự kiện mới</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          change={{ value: 12.5, type: 'increase' }}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          change={{ value: 8.2, type: 'increase' }}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Phòng đang hoạt động"
          value={stats.activeRooms}
          change={{ value: 3.1, type: 'decrease' }}
          icon={Gamepad2}
          color="purple"
        />
        <StatCard
          title="Doanh thu tháng"
          value={`${(stats.monthlyRevenue / 1000000).toFixed(1)}M VND`}
          change={{ value: 15.3, type: 'increase' }}
          icon={DollarSign}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Người dùng mới trong tuần
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="value" fill="#3B82F6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hoạt động trong tuần
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sự kiện sắp tới</h3>
            <Button variant="ghost" size="sm">Xem tất cả</Button>
          </div>
          <div className="space-y-4">
            {MOCK_EVENTS.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{event.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.game}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant="info">{event.status}</Badge>
                    <span className="text-xs text-gray-500">
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Rooms */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phòng đang hoạt động</h3>
            <Button variant="ghost" size="sm">Xem tất cả</Button>
          </div>
          <div className="space-y-4">
            {MOCK_ROOMS.map((room) => (
              <div key={room.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Gamepad2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white">{room.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{room.game}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant={room.status === 'active' ? 'success' : 'warning'}>
                      {room.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {room.participants.length}/{room.maxParticipants} players
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}