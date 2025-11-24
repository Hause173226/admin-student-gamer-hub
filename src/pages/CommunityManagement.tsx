import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance.ts';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { useState } from 'react';
import { useAuthStore } from '../stores/AuthStore.ts';

interface CommunityItem {
    CommunityId: string;
    Name: string;
    Description: string;
    School: string;
    IsPublic: boolean;
    CachedMembersCount: number;
    ClubsCount: number;
    EventsCount: number;
    ActualMembersCount: number;
    GamesCount: number;
    CreatedAtUtc: string;
    UpdatedAtUtc?: string;
    IsDeleted: boolean;
}

interface CommunitiesResponse {
    Items: CommunityItem[]; // Array from your API
    Page: number;
    Size: number;
    TotalCount: number;
    TotalPages: number;
    HasPrevious: boolean;
    HasNext: boolean;
    Sort: string;
    Desc: boolean;
}

export function CommunityManagement() {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);

    const { data, isLoading, isFetching, error } = useQuery<CommunitiesResponse>({
        queryKey: ['communities', page],
        queryFn: () => axiosInstance.get(`/admin/dashboard/communities?page=${page}&size=20`).then(res => res.data),
        placeholderData: keepPreviousData, // Smooth pagination
        staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
        refetchOnWindowFocus: false, // Don't refetch when switching tabs
        refetchOnMount: false, // Don't refetch on mount if data exists
    });

    const communities = data?.Items || [];
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
                                <TableHead>School</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead>Clubs</TableHead>
                                <TableHead>Events</TableHead>
                                <TableHead>Games</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
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

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <p>Error loading communities: {error.message}</p>
            <button onClick={() => location.reload()} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Managing {data?.TotalCount || 0} communities.</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Public?</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Clubs</TableHead>
                            <TableHead>Events</TableHead>
                            <TableHead>Games</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableSkeleton rows={10} columns={10} />
                        ) : (
                            communities.map((community) => {
                            const members = community.CachedMembersCount.toLocaleString();
                            const status = community.IsPublic ? 'Public' : 'Private';
                            const statusVariant = community.IsPublic ? 'success' : 'warning';
                            return (
                                <TableRow key={community.CommunityId}>
                                    <TableCell className="font-medium">{community.Name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{community.Description}</TableCell>
                                    <TableCell>{community.School}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{members}</TableCell>
                                    <TableCell>{community.ClubsCount}</TableCell>
                                    <TableCell>{community.EventsCount}</TableCell>
                                    <TableCell>{community.GamesCount}</TableCell>
                                    <TableCell>{new Date(community.CreatedAtUtc).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                                        <button className="text-green-600 hover:text-green-900">Edit</button>
                                        <button className="text-red-600 hover:text-red-900 ml-2">Delete</button>
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
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!data?.HasNext || page >= totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default CommunityManagement;