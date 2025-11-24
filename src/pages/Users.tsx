import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance.ts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { useState } from "react";
import UserDetailModal from "./UserDetailModal"; // 🔥 NEW MODAL

interface ApiUser {
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

interface ApiResponse {
  Items: ApiUser[];
  Page: number;
  Size: number;
  TotalCount: number;
  TotalPages: number;
  HasPrevious: boolean;
  HasNext: boolean;
  Sort: string;
  Desc: boolean;
}

export function Users() {
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // 🔥 MODAL STATE

  const { data, isLoading, isFetching } = useQuery<ApiResponse>({
    queryKey: ["users", page],
    queryFn: () =>
      axiosInstance
        .get(`/admin/dashboard/users?page=${page}&size=20`)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    refetchOnWindowFocus: false, // Don't refetch when switching tabs
    refetchOnMount: false, // Don't refetch on mount if data exists
  });

  const apiUsers = data?.Items || [];

  const openModal = (userId: string) => setSelectedUserId(userId);
  const closeModal = () => setSelectedUserId(null);

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={10} columns={8} />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Managing {data?.TotalCount || 0} users.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableSkeleton rows={10} columns={8} />
            ) : (
              apiUsers.map((apiUser) => {
                const status = apiUser.IsDeleted
                  ? "inactive"
                  : apiUser.Roles.includes("Admin")
                  ? "admin"
                  : "active";
                return (
                  <TableRow key={apiUser.UserId}>
                    <TableCell>
                      <img
                        src={
                          apiUser.AvatarUrl ||
                          "https://via.placeholder.com/40?text=U"
                        }
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {apiUser.FullName}
                    </TableCell>
                    <TableCell>{apiUser.Email}</TableCell>
                    <TableCell>
                      <Badge variant="info">{apiUser.Level}</Badge>
                    </TableCell>
                    <TableCell>{apiUser.Points}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {new Date(apiUser.CreatedAtUtc).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => openModal(apiUser.UserId)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        View
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Ban
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {data?.TotalPages || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(data?.TotalPages || 1, p + 1))}
          disabled={!data?.HasNext || page >= (data?.TotalPages || 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* 🔥 MODAL – Opens on View click */}
      {selectedUserId && (
        <UserDetailModal userId={selectedUserId} onClose={closeModal} />
      )}
    </div>
  );
}

export default Users;
