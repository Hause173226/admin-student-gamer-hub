import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance.ts';
import StatCard from '../components/ui/StatCard';
import { Users, Building2, Calendar, DollarSign, AlertCircle, Gamepad2, ShoppingCart, Award } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuthStore } from '../stores/AuthStore.ts';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface DashboardSummary {
    TotalUsers: number;
    NewUsersLast30Days: number;
    ActiveCommunities: number;
    TotalClubs: number;
    TotalGames: number;
    TotalEvents: number;
    TotalRevenueVND: number;
    RevenueThisMonthVND: number;
    SuccessfulTransactions: number;
    ActiveMemberships: number;
    OpenBugReports: number;
    GeneratedAtUtc: string;
}

interface RevenueResponse {
    PeriodType: string;
    PeriodStart: string;
    PeriodEnd: string;
    TotalRevenueCents: number;
    MembershipRevenueCents: number;
    EventRevenueCents: number;
    TopUpRevenueCents: number;
    TransactionCount: number;
    SuccessfulCount: number;
    FailedCount: number;
    DailyBreakdown: Array<{
        Date: string;
        RevenueCents: number;
        TransactionCount: number;
    }>;
}

interface ChartData {
    date: string;
    revenue: number;
    transactions: number;
}

export function Dashboard() {
    const { user } = useAuthStore();
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

    // Summary query
    const { data: summaryData } = useQuery<DashboardSummary>({
        queryKey: ['dashboardSummary'],
        queryFn: () => axiosInstance.get('/admin/dashboard/summary').then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    // ✅ FIXED: only one endpoint, pass query param
    const { data: revenueData, isLoading: revenueLoading } = useQuery<RevenueResponse>({
        queryKey: ['revenue', period],
        queryFn: () =>
            axiosInstance
                .get(`/admin/dashboard/revenue`, { params: { period } }) // ✅ /revenue?period=week
                .then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const stats = summaryData || {};

    const chartData: ChartData[] = (revenueData?.DailyBreakdown || []).map(day => ({
        date: new Date(day.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: day.RevenueCents / 100,
        transactions: day.TransactionCount,
    }));

    const totalRevenueVND = (revenueData?.TotalRevenueCents || 0) / 100;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome, {user?.name}! Stats as of{' '}
                        <Badge variant="info">
                            {stats.GeneratedAtUtc ? new Date(stats.GeneratedAtUtc).toLocaleString() : '—'}
                        </Badge>
                        .
                    </p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.TotalUsers} icon={Users} color="blue" />
                <StatCard title="New Users Last 30 Days" value={stats.NewUsersLast30Days} icon={Users} color="green" />
                <StatCard title="Active Communities" value={stats.ActiveCommunities} icon={Building2} color="purple" />
                <StatCard title="Total Clubs" value={stats.TotalClubs} icon={Building2} color="blue" />
                <StatCard title="Total Games" value={stats.TotalGames} icon={Gamepad2} color="green" />
                <StatCard title="Total Events" value={stats.TotalEvents} icon={Calendar} color="purple" />
                <StatCard title="Total Revenue (VND)" value={stats.TotalRevenueVND?.toLocaleString() || '0'} icon={DollarSign} color="orange" />
                <StatCard title="Revenue This Month (VND)" value={stats.RevenueThisMonthVND?.toLocaleString() || '0'} icon={DollarSign} color="green" />
                <StatCard title="Successful Transactions" value={stats.SuccessfulTransactions} icon={ShoppingCart} color="blue" />
                <StatCard title="Active Memberships" value={stats.ActiveMemberships} icon={Award} color="green" />
                <StatCard title="Open Bug Reports" value={stats.OpenBugReports} icon={AlertCircle} color="red" />
            </div>

            {/* Period Selector */}
            <div className="flex justify-center mb-4">
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                >
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                </select>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                    Revenue Breakdown ({period.toUpperCase()})
                </h3>
                {revenueLoading ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Loading revenue data...</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Total: {totalRevenueVND.toLocaleString('vi-VN')} VND | Period:{' '}
                            {new Date(revenueData?.PeriodStart || '').toLocaleDateString()} to{' '}
                            {new Date(revenueData?.PeriodEnd || '').toLocaleDateString()}
                        </p>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" tickFormatter={(v) => `${v.toLocaleString('vi-VN')} VND`} />
                                <Tooltip
                                    formatter={(value: number, name: string) => [
                                        name === 'revenue' ? `${value.toLocaleString('vi-VN')} VND` : value,
                                        name,
                                    ]}
                                />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (VND)" />
                                <Bar dataKey="transactions" fill="#10b981" name="Transactions" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
