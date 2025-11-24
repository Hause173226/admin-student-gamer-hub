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
import { Button } from "../components/ui/Button";

interface ClubItem {
  ClubId: string;
  Name: string;
  Description: string;
  IsPublic: boolean;
  CommunityId: string;
  CommunityName: string;
  RoomsCount: number;
  MembersCount: number;
  CreatedAtUtc: string;
  UpdatedAtUtc?: string | null;
  IsDeleted: boolean;
}

interface ClubsResponse {
  Items: ClubItem[];
  Page: number;
  Size: number;
  TotalCount: number;
  TotalPages: number;
  HasPrevious: boolean;
  HasNext: boolean;
  Sort: string;
  Desc: boolean;
}

export function ClubManagement() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useQuery<ClubsResponse>({
    queryKey: ["clubs", page],
    queryFn: () =>
      axiosInstance
        .get(`/admin/dashboard/clubs?page=${page}&size=20`)
        .then((res) => res.data),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    refetchOnWindowFocus: false, // Don't refetch when switching tabs
    refetchOnMount: false, // Don't refetch on mount if data exists
  });

  const clubs = data?.Items || [];
  const totalPages = data?.TotalPages || 1;

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Community</TableHead>
                <TableHead>Rooms</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={10} columns={7} />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading clubs: {(error as Error).message}</p>
        <Button variant="primary" onClick={() => location.reload()}>
          Retry
        </Button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Club Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Managing {data?.TotalCount || 0} clubs.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Public?</TableHead>
              <TableHead>Rooms</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <TableSkeleton rows={10} columns={8} />
            ) : (
              clubs.map((club) => {
                const status = club.IsPublic ? "Public" : "Private";
                const variant = club.IsPublic ? "success" : "warning";
                return (
                  <TableRow key={club.ClubId}>
                    <TableCell className="font-medium">{club.Name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {club.Description}
                    </TableCell>
                    <TableCell>{club.CommunityName}</TableCell>
                    <TableCell>
                      <Badge variant={variant}>{status}</Badge>
                    </TableCell>
                    <TableCell>{club.RoomsCount}</TableCell>
                    <TableCell>{club.MembersCount}</TableCell>
                    <TableCell>
                      {new Date(club.CreatedAtUtc).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Delete
                      </Button>
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
        <Button
          variant="primary"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={!data?.HasNext || page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ClubManagement;
