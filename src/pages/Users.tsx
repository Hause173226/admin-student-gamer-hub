import { useState } from 'react';
import { Search, Filter, UserPlus, MoreHorizontal, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Menu } from '@headlessui/react';
import { MOCK_USERS } from '../constants/mockData';
import { clsx } from 'clsx';

export function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [users] = useState(MOCK_USERS);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.university.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'banned': return 'error';
      default: return 'default';
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'moderator': return 'warning';
      case 'student': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý người dùng</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý tài khoản sinh viên và phân quyền trong hệ thống
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={Filter}>Bộ lọc</Button>
          <Button icon={UserPlus}>Thêm người dùng</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tổng người dùng</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'inactive').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Không hoạt động</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'banned').length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Bị cấm</div>
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
                placeholder="Tìm kiếm theo tên, email hoặc trường..."
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
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị cấm</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Người dùng</TableHead>
              <TableHead>Trường</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hoạt động</TableHead>
              <TableHead>Thống kê</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-white">{user.university}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)}>
                    {user.role === 'admin' ? 'Quản trị viên' : 
                     user.role === 'moderator' ? 'Kiểm duyệt viên' : 'Sinh viên'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status === 'active' ? 'Hoạt động' : 
                     user.status === 'inactive' ? 'Không hoạt động' : 'Bị cấm'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(user.lastActive).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Tham gia: {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.gamesPlayed} games
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user.hoursPlayed}h played
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
                              <Shield className="w-4 h-4 mr-3" />
                              Phân quyền
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
                              Xóa
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