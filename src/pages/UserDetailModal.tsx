import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance.ts";
import {
  X,
  User,
  Mail,
  Calendar,
  DollarSign,
  Award,
  Users,
  Building2,
} from "lucide-react";
import Badge from "../components/ui/Badge";

interface UserDetail {
  UserId: string;
  UserName: string;
  Email: string;
  FullName: string;
  AvatarUrl?: string;
  Level: number;
  Points: number;
  WalletBalanceCents: number;
  CurrentMembership?: string;
  MembershipExpiresAt?: string;
  EventsCreated: number;
  EventsAttended: number;
  CommunitiesJoined: number;
  TotalSpentCents: number;
  Roles: string[];
  CreatedAtUtc: string;
  UpdatedAtUtc?: string;
  IsDeleted: boolean;
}

interface UserDetailModalProps {
  userId: string;
  onClose: () => void;
}

export default function UserDetailModal({
  userId,
  onClose,
}: UserDetailModalProps) {
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery<UserDetail>({
    queryKey: ["userDetail", userId],
    queryFn: () =>
      axiosInstance
        .get(`/admin/dashboard/users/${userId}`)
        .then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Đang tải thông tin...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Lỗi
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-red-600 dark:text-red-400">
            Không thể tải thông tin người dùng. Vui lòng thử lại.
          </p>
        </div>
      </div>
    );
  }

  const walletBalanceVND = userData.WalletBalanceCents / 100;
  const totalSpentVND = userData.TotalSpentCents / 100;
  const status = userData.IsDeleted
    ? "inactive"
    : userData.Roles.includes("Admin")
    ? "admin"
    : "active";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chi Tiết Người Dùng
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info Section */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex-shrink-0">
              {userData.AvatarUrl ? (
                <img
                  src={userData.AvatarUrl}
                  alt={userData.FullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    if (e.currentTarget.nextElementSibling) {
                      (
                        e.currentTarget.nextElementSibling as HTMLElement
                      ).style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div
                className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-gray-200 dark:border-gray-700"
                style={{ display: userData.AvatarUrl ? "none" : "flex" }}
              >
                <span className="text-4xl font-medium">
                  {userData.FullName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {userData.FullName}
                </h3>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge
                    variant={
                      status === "active"
                        ? "success"
                        : status === "admin"
                        ? "info"
                        : "error"
                    }
                  >
                    {status}
                  </Badge>
                  {userData.Roles.map((role) => (
                    <Badge key={role} variant="info">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Username
                    </p>
                    <p className="font-medium">{userData.UserName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium">{userData.Email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Award className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Level
                    </p>
                    <p className="font-medium">{userData.Level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Award className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Points
                    </p>
                    <p className="font-medium">
                      {userData.Points.toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ví
                    </p>
                    <p className="font-medium">
                      {walletBalanceVND.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ngày tham gia
                    </p>
                    <p className="font-medium">
                      {new Date(userData.CreatedAtUtc).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Communities
                </p>
              </div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {userData.CommunitiesJoined}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  Events Created
                </p>
              </div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {userData.EventsCreated}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Events Attended
                </p>
              </div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {userData.EventsAttended}
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Tổng Chi Tiêu
                </p>
              </div>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {totalSpentVND.toLocaleString("vi-VN")} VND
              </p>
            </div>
          </div>

          {/* Membership Info */}
          {userData.CurrentMembership && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Membership</p>
                  <p className="text-xl font-bold">
                    {userData.CurrentMembership}
                  </p>
                </div>
                {userData.MembershipExpiresAt && (
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Hết hạn</p>
                    <p className="text-lg font-semibold">
                      {new Date(
                        userData.MembershipExpiresAt
                      ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Thông Tin Bổ Sung
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-mono text-gray-900 dark:text-white">
                  {userData.UserId}
                </p>
              </div>
              {userData.UpdatedAtUtc && (
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Cập nhật lần cuối
                  </p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(userData.UpdatedAtUtc).toLocaleString("vi-VN")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
