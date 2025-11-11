import { useState } from 'react';
import { Search, Filter, Plus, MoreHorizontal, Play, Pause, Users as UsersIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Menu } from '@headlessui/react';
import { MOCK_ROOMS } from '../constants/mockData';
import { clsx } from 'clsx';

export default function GameRooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [rooms] = useState(MOCK_ROOMS);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'waiting': return 'warning';
      case 'full': return 'info';
      case 'ended': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang chơi';
      case 'waiting': return 'Chờ người chơi';
      case 'full': return 'Đầy';
      case 'ended': return 'Đã kết thúc';
      default: return status;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý phòng game</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Theo dõi và quản lý các phòng chat/voice đang hoạt động
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Filter}>Bộ lọc</Button>
          <Button icon={Plus}>Tạo phòng mới</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{rooms.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng phòng</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{rooms.filter(r => r.status === 'active').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{rooms.filter(r => r.status === 'waiting').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Chờ người chơi</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600">{rooms.reduce((acc, r) => acc + r.participants.length, 0)}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng người chơi</div>
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
                placeholder="Tìm kiếm theo tên phòng, game hoặc người tạo..."
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
            <option value="active">Đang hoạt động</option>
            <option value="waiting">Chờ người chơi</option>
            <option value="full">Đầy</option>
            <option value="ended">Đã kết thúc</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phòng game</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Người chơi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Tính năng</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{room.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{room.game}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={room.creator.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(room.creator.name)}&background=3b82f6&color=fff`}
                      alt={room.creator.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{room.creator.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{room.creator.university}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {room.participants.length}/{room.maxParticipants}
                    </span>
                  </div>
                  <div className="flex -space-x-2 mt-1">
                    {room.participants.slice(0, 3).map((participant, index) => (
                      <img
                        key={participant.id}
                        src={participant.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=random&color=fff`}
                        alt={participant.name}
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                        title={participant.name}
                      />
                    ))}
                    {room.participants.length > 3 && (
                      <div className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">+{room.participants.length - 3}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(room.status)}>
                    {getStatusText(room.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {room.status === 'active' ? formatDuration(room.duration) : 'Chưa bắt đầu'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tạo: {new Date(room.createdAt).toLocaleTimeString('vi-VN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    {room.isVoiceEnabled && (
                      <Badge variant="info" size="sm">Voice</Badge>
                    )}
                    {room.isPrivate && (
                      <Badge variant="warning" size="sm">Private</Badge>
                    )}
                  </div>
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
                              <Play className="w-4 h-4 mr-3" />
                              Tham gia
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
                              <Pause className="w-4 h-4 mr-3" />
                              Tạm dừng
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
                              <Pause className="w-4 h-4 mr-3" />
                              Kết thúc phòng
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