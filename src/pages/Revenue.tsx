import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance.ts";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Ticket,
  Wallet,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
  membership: number;
  events: number;
  topUp: number;
}

export function Revenue() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
      staleTime: 0,
    });

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
      membership: 0, // Will be calculated if needed
      events: 0,
      topUp: 0,
    })
  );

  // Revenue breakdown by type for pie chart
  // API returns values in VND (not cents), so no division needed
  const revenueByType = [
    {
      name: "Membership",
      value: revenueData?.MembershipRevenueCents || 0, // Already in VND
      color: "#3b82f6",
    },
    {
      name: "Events",
      value: revenueData?.EventRevenueCents || 0, // Already in VND
      color: "#10b981",
    },
    {
      name: "Top Up",
      value: revenueData?.TopUpRevenueCents || 0, // Already in VND
      color: "#f59e0b",
    },
  ].filter((item) => item.value > 0);

  // API returns values in VND (not cents), so no division needed
  const totalRevenueVND = revenueData?.TotalRevenueCents || 0;
  const membershipRevenueVND = revenueData?.MembershipRevenueCents || 0;
  const eventRevenueVND = revenueData?.EventRevenueCents || 0;
  const topUpRevenueVND = revenueData?.TopUpRevenueCents || 0;

  // Custom tooltip
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
              {entry.name.includes("Revenue") ||
              entry.name.includes("Doanh Thu")
                ? `${entry.value.toLocaleString("vi-VN")} VND`
                : entry.value.toLocaleString("vi-VN")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (revenueLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu doanh thu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Revenue Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý và phân tích doanh thu hệ thống
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Chọn kỳ:
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
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
              Khoảng ngày tùy chỉnh
            </label>
            {customDateRange ? (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-blue-500"
                />
                <span className="self-center text-gray-500">đến</span>
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

        {/* Period Info */}
        {revenueData?.PeriodStart && revenueData?.PeriodEnd && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Kỳ:</span>{" "}
              {new Date(revenueData.PeriodStart).toLocaleDateString("vi-VN")} -{" "}
              {new Date(revenueData.PeriodEnd).toLocaleDateString("vi-VN")} (
              {revenueData.PeriodType})
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm opacity-90">Tổng Doanh Thu</p>
            <DollarSign className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {totalRevenueVND.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-xs opacity-75 mt-1">
            {revenueData?.PeriodType || "N/A"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm opacity-90">Membership</p>
            <CreditCard className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {membershipRevenueVND.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-xs opacity-75 mt-1">
            {totalRevenueVND > 0
              ? `${((membershipRevenueVND / totalRevenueVND) * 100).toFixed(
                  1
                )}%`
              : "0%"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm opacity-90">Events</p>
            <Ticket className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {eventRevenueVND.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-xs opacity-75 mt-1">
            {totalRevenueVND > 0
              ? `${((eventRevenueVND / totalRevenueVND) * 100).toFixed(1)}%`
              : "0%"}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm opacity-90">Top Up</p>
            <Wallet className="w-6 h-6 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {topUpRevenueVND.toLocaleString("vi-VN")} VND
          </p>
          <p className="text-xs opacity-75 mt-1">
            {totalRevenueVND > 0
              ? `${((topUpRevenueVND / totalRevenueVND) * 100).toFixed(1)}%`
              : "0%"}
          </p>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tổng Giao Dịch
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {revenueData?.TransactionCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thành Công
              </p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {revenueData?.SuccessfulCount || 0}
              </p>
            </div>
          </div>
          {revenueData?.TransactionCount &&
            revenueData.TransactionCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tỷ lệ:{" "}
                {(
                  (revenueData.SuccessfulCount / revenueData.TransactionCount) *
                  100
                ).toFixed(1)}
                %
              </p>
            )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Thất Bại
              </p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {revenueData?.FailedCount || 0}
              </p>
            </div>
          </div>
          {revenueData?.TransactionCount &&
            revenueData.TransactionCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tỷ lệ:{" "}
                {(
                  (revenueData.FailedCount / revenueData.TransactionCount) *
                  100
                ).toFixed(1)}
                %
              </p>
            )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Xu Hướng Doanh Thu Hàng Ngày
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
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
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              Không có dữ liệu cho kỳ này
            </div>
          )}
        </div>

        {/* Revenue by Type Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Phân Loại Doanh Thu
          </h3>
          {revenueByType.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
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

      {/* Daily Breakdown Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chi Tiết Doanh Thu Theo Ngày
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Doanh Thu (VND)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Số Giao Dịch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trung Bình/Giao Dịch
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {revenueData?.DailyBreakdown &&
              revenueData.DailyBreakdown.length > 0 ? (
                revenueData.DailyBreakdown.map((day, index) => {
                  const revenueVND = day.RevenueCents; // Already in VND
                  const avgPerTransaction =
                    day.TransactionCount > 0
                      ? revenueVND / day.TransactionCount
                      : 0;
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(day.Date).toLocaleDateString("vi-VN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                        {revenueVND.toLocaleString("vi-VN")} VND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {day.TransactionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {avgPerTransaction.toLocaleString("vi-VN")} VND
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không có dữ liệu cho kỳ này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
