import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance.ts";
import StatCard from "../components/ui/StatCard";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  Gamepad2,
  ShoppingCart,
  Award,
  TrendingUp,
  CreditCard,
  Ticket,
  Wallet,
} from "lucide-react";
import Badge from "../components/ui/Badge";
import { useAuthStore } from "../stores/AuthStore.ts";
import { useState } from "react";
import {
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";

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
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Summary query
  const { data: summaryData } = useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: () =>
      axiosInstance.get("/admin/dashboard/summary").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Revenue query with period or custom date range
  const revenueParams: {
    period?: string;
    startDate?: string;
    endDate?: string;
  } =
    customDateRange && startDate && endDate
      ? { startDate, endDate }
      : { period };

  const { data: revenueData, isLoading: revenueLoading } =
    useQuery<RevenueResponse>({
      queryKey: ["revenue", period, startDate, endDate, customDateRange],
      queryFn: () =>
        axiosInstance
          .get(`/admin/dashboard/revenue`, { params: revenueParams })
          .then((res) => res.data),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const stats: DashboardSummary = summaryData || {
    TotalUsers: 0,
    NewUsersLast30Days: 0,
    ActiveCommunities: 0,
    TotalClubs: 0,
    TotalGames: 0,
    TotalEvents: 0,
    TotalRevenueVND: 0,
    RevenueThisMonthVND: 0,
    SuccessfulTransactions: 0,
    ActiveMemberships: 0,
    OpenBugReports: 0,
    GeneratedAtUtc: "",
  };

  // Format chart data for daily breakdown
  // API returns values in VND (not cents), so no division needed
  const chartData: ChartData[] = (revenueData?.DailyBreakdown || []).map(
    (day) => ({
      date: new Date(day.Date).toLocaleDateString("vi-VN", {
        month: "short",
        day: "numeric",
      }),
      revenue: day.RevenueCents, // Already in VND
      transactions: day.TransactionCount,
    })
  );

  // Revenue breakdown by type for pie chart
  // API returns values in VND (not cents), so no division needed
  const revenueByType = [
    {
      name: "Membership",
      value: revenueData?.MembershipRevenueCents || 0, // Already in VND
      color: "#3b82f6",
      icon: CreditCard,
    },
    {
      name: "Events",
      value: revenueData?.EventRevenueCents || 0, // Already in VND
      color: "#10b981",
      icon: Ticket,
    },
    {
      name: "Top Up",
      value: revenueData?.TopUpRevenueCents || 0, // Already in VND
      color: "#f59e0b",
      icon: Wallet,
    },
  ].filter((item) => item.value > 0);

  // API returns values in VND (not cents), so no division needed
  const totalRevenueVND = revenueData?.TotalRevenueCents || 0;
  const membershipRevenueVND = revenueData?.MembershipRevenueCents || 0;
  const eventRevenueVND = revenueData?.EventRevenueCents || 0;
  const topUpRevenueVND = revenueData?.TopUpRevenueCents || 0;

  // Custom tooltip component
  interface TooltipEntry {
    name: string;
    value: number;
    color: string;
  }
  interface TooltipProps {
    active?: boolean;
    payload?: TooltipEntry[];
    label?: string;
  }
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry: TooltipEntry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "Revenue (VND)" ||
              entry.name === "Doanh Thu (VND)"
                ? `${entry.value.toLocaleString("vi-VN")} VND`
                : entry.value.toLocaleString("vi-VN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const summaryLoading = !summaryData;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          {summaryLoading ? (
            <div className="mt-3 h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Welcome, {user?.name}! Stats as of{" "}
              <Badge variant="info">
                {stats.GeneratedAtUtc
                  ? new Date(stats.GeneratedAtUtc).toLocaleString()
                  : "—"}
              </Badge>
              .
            </p>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryLoading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="h-32 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats.TotalUsers}
              icon={Users}
              color="blue"
            />
            <StatCard
              title="New Users Last 30 Days"
              value={stats.NewUsersLast30Days}
              icon={Users}
              color="green"
            />
            <StatCard
              title="Active Communities"
              value={stats.ActiveCommunities}
              icon={Building2}
              color="purple"
            />
            <StatCard
              title="Total Clubs"
              value={stats.TotalClubs}
              icon={Building2}
              color="blue"
            />
            <StatCard
              title="Total Games"
              value={stats.TotalGames}
              icon={Gamepad2}
              color="green"
            />
            <StatCard
              title="Total Events"
              value={stats.TotalEvents}
              icon={Calendar}
              color="purple"
            />
            <StatCard
              title="Total Revenue (VND)"
              value={
                stats.TotalRevenueVND
                  ? (stats.TotalRevenueVND * 100).toLocaleString("vi-VN")
                  : "0"
              }
              icon={DollarSign}
              color="orange"
            />
            <StatCard
              title="Revenue This Month (VND)"
              value={
                stats.RevenueThisMonthVND
                  ? (stats.RevenueThisMonthVND * 100).toLocaleString("vi-VN")
                  : "0"
              }
              icon={DollarSign}
              color="green"
            />
            <StatCard
              title="Successful Transactions"
              value={stats.SuccessfulTransactions}
              icon={ShoppingCart}
              color="blue"
            />
            <StatCard
              title="Active Memberships"
              value={stats.ActiveMemberships}
              icon={Award}
              color="green"
            />
            <StatCard
              title="Open Bug Reports"
              value={stats.OpenBugReports}
              icon={AlertCircle}
              color="red"
            />
          </>
        )}
      </div>

      {/* Revenue Section */}
      <div className="space-y-6">
        {/* Period Selector & Custom Date Range */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Revenue Analytics
            </h2>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={customDateRange}
                  onChange={(e) => {
                    setCustomDateRange(e.target.checked);
                    if (!e.target.checked) {
                      setStartDate("");
                      setEndDate("");
                    }
                  }}
                  className="rounded"
                />
                Custom Date Range
              </label>
              {customDateRange ? (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as "week" | "month" | "year")
                  }
                  className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="year">Năm nay</option>
                </select>
              )}
            </div>
          </div>

          {/* Revenue Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Tổng Doanh Thu</p>
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">
                {totalRevenueVND.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Membership</p>
                <CreditCard className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">
                {membershipRevenueVND.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Events</p>
                <Ticket className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">
                {eventRevenueVND.toLocaleString("vi-VN")} VND
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm opacity-90">Top Up</p>
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold">
                {topUpRevenueVND.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Tổng Giao Dịch
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {revenueData?.TransactionCount || 0}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">
                Thành Công
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">
                {revenueData?.SuccessfulCount || 0}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                Thất Bại
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">
                {revenueData?.FailedCount || 0}
              </p>
            </div>
          </div>

          {revenueLoading ? (
            <div className="space-y-6">
              {/* Period Info Skeleton */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
              </div>

              {/* Charts Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Skeleton */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4 animate-pulse"></div>
                  <div className="h-[350px] bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
                {/* Pie Chart Skeleton */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 animate-pulse"></div>
                  <div className="h-[250px] bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Period Info */}
              {revenueData?.PeriodStart && revenueData?.PeriodEnd && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Kỳ:</span>{" "}
                    {new Date(revenueData.PeriodStart).toLocaleDateString(
                      "vi-VN"
                    )}{" "}
                    -{" "}
                    {new Date(revenueData.PeriodEnd).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              )}

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Revenue Trend - Composed Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Xu Hướng Doanh Thu Hàng Ngày
                  </h3>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <ComposedChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="colorRevenue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#3b82f6"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#3b82f6"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          className="dark:stroke-gray-700"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          className="dark:text-gray-400"
                          tick={{ fill: "#6b7280" }}
                        />
                        <YAxis
                          yAxisId="left"
                          stroke="#6b7280"
                          tick={{ fill: "#6b7280" }}
                          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#10b981"
                          tick={{ fill: "#10b981" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          fill="url(#colorRevenue)"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Doanh Thu (VND)"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="transactions"
                          fill="#10b981"
                          name="Số Giao Dịch"
                          radius={[4, 4, 0, 0]}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
                      Không có dữ liệu cho kỳ này
                    </div>
                  )}
                </div>

                {/* Revenue by Type - Pie Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Phân Loại Doanh Thu
                  </h3>
                  {revenueByType.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={revenueByType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {revenueByType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) =>
                              `${value.toLocaleString("vi-VN")} VND`
                            }
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2">
                        {revenueByType.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.name}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {item.value.toLocaleString("vi-VN")} VND
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
