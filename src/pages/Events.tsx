import { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Edit, Trash2, Users as UsersIcon, Calendar, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Menu } from '@headlessui/react';
import { MOCK_EVENTS } from '../constants/mockData';
import { clsx } from 'clsx';

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [events] = useState(MOCK_EVENTS);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'success';
      case 'completed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý sự kiện</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tạo và quản lý các sự kiện gaming cho sinh viên
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Filter}>Bộ lọc</Button>
          <Button icon={Plus}>Tạo sự kiện mới</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{events.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng sự kiện</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">{events.filter(e => e.status === 'upcoming').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Sắp diễn ra</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'ongoing').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đang diễn ra</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600">{events.reduce((acc, e) => acc + e.currentParticipants, 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng tham gia</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sự kiện, game hoặc người tổ chức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="ongoing">Đang diễn ra</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sự kiện</TableHead>
              <TableHead>Người tổ chức</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Tham gia</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giải thưởng</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{event.game}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                        {event.description.substring(0, 60)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={event.organizer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer.name)}&background=3b82f6&color=fff`}
                      alt={event.organizer.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{event.organizer.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{event.organizer.university}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-white">
                    <div>Bắt đầu: {formatDate(event.startDate)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Kết thúc: {formatDate(event.endDate)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {event.currentParticipants}/{event.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Đăng ký đến: {formatDate(event.registrationDeadline)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.prize ? (
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.prize}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Không có</span>
                  )}
                </TableCell>
                <TableCell>
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-10">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm text-left',
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'text-gray-700 dark:text-gray-300'
                              )}
                            >
                              <Edit className="w-4 h-4 mr-3" />
                              Chỉnh sửa
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm text-left',
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'text-gray-700 dark:text-gray-300'
                              )}
                            >
                              <UsersIcon className="w-4 h-4 mr-3" />
                              Xem danh sách
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={clsx(
                                'flex items-center w-full px-4 py-2 text-sm text-left',
                                active ? 'bg-gray-100 dark:bg-gray-700' : '',
                                'text-red-600 dark:text-red-400'
                              )}
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Xóa sự kiện
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}