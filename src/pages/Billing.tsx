import { useState } from 'react';
import { CreditCard, TrendingUp, Users, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { MOCK_BILLING_PLANS, MOCK_USERS } from '../constants/mockData';

export function Billing() {
  const [plans] = useState(MOCK_BILLING_PLANS);
  const [subscriptions] = useState(
    MOCK_USERS.slice(0, 5).map(user => ({
      id: `sub-${user.id}`,
      user,
      plan: plans[Math.floor(Math.random() * plans.length)],
      startDate: '2024-01-01T00:00:00',
      endDate: '2024-02-01T00:00:00',
      status: 'active' as const,
      paymentMethod: 'Thẻ tín dụng',
      amount: plans[Math.floor(Math.random() * plans.length)].price
    }))
  );

  const totalRevenue = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
  const totalUsers = MOCK_USERS.length;
  const conversionRate = (activeSubscriptions / totalUsers) * 100;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý thanh toán</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý gói thành viên và theo dõi doanh thu
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Xuất báo cáo</Button>
          <Button icon={Plus}>Tạo gói mới</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Doanh thu tháng"
          value={formatPrice(totalRevenue)}
          change={{ value: 12.5, type: 'increase' }}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Thuê bao hoạt động"
          value={activeSubscriptions}
          change={{ value: 8.2, type: 'increase' }}
          icon={CreditCard}
          color="blue"
        />
        <StatCard
          title="Tỷ lệ chuyển đổi"
          value={`${conversionRate.toFixed(1)}%`}
          change={{ value: 3.1, type: 'increase' }}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Tổng người dùng"
          value={totalUsers}
          change={{ value: 15.3, type: 'increase' }}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Billing Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gói thành viên</h2>
          <Button variant="outline" size="sm" icon={Plus}>Thêm gói mới</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-2 ${
                plan.isPopular 
                  ? 'border-blue-500 shadow-blue-100 dark:shadow-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="info">Phổ biến nhất</Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/tháng</span>
                </div>
                <Badge variant={plan.status === 'active' ? 'success' : 'default'}>
                  {plan.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-4 h-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={Edit} className="flex-1">
                  Chỉnh sửa
                </Button>
                <Button variant="ghost" size="sm" icon={Trash2}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Subscriptions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Thuê bao gần đây</h2>
          <Button variant="ghost" size="sm">Xem tất cả</Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Gói</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={subscription.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(subscription.user.name)}&background=3b82f6&color=fff`}
                        alt={subscription.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {subscription.user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscription.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {subscription.plan.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {subscription.plan.duration} tháng
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscription.status === 'active' ? 'success' : 'default'}>
                      {subscription.status === 'active' ? 'Hoạt động' : 'Hết hạn'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {subscription.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(subscription.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(subscription.startDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Đến: {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}