import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { formatAmountCents } from '../utils/formatCurrency'; // Import formatter

interface PaymentItem {
    Id: string;
    UserId: string;
    UserName: string;
    UserEmail: string;
    AmountCents: number;
    Purpose: number;
    PurposeDisplay: string;
    EventId?: string;
    EventTitle?: string;
    EventRegistrationId?: string;
    MembershipPlanId?: string;
    MembershipPlanName?: string;
    Status: number;
    StatusDisplay: string;
    OrderCode?: number;
    ExpiresAt?: string;
    CreatedAtUtc: string;
    UpdatedAtUtc?: string;
}

interface PaymentsResponse {
    Items: PaymentItem[];
    Page: number;
    Size: number;
    TotalCount: number;
    TotalPages: number;
    HasPrevious: boolean;
    HasNext: boolean;
    Sort: string;
    Desc: boolean;
}

export function PaymentsManagement() {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery<PaymentsResponse>({
        queryKey: ['payments', page],
        queryFn: () => axiosInstance.get(`/admin/dashboard/payments?page=${page}&size=20`).then(res => res.data),
        keepPreviousData: true,
    });

    const payments = data?.Items || [];
    const totalPages = data?.TotalPages || 1;

    if (isLoading) return <div className="p-8 text-center">Loading payments...</div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <p>Error loading payments: {error.message}</p>
            <button onClick={() => location.reload()} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Managing {data?.TotalCount || 0} payments. Page {page} of {totalPages}.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount (VND)</TableHead>
                            <TableHead>Purpose</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Order Code</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment) => {
                            const amountVND = formatAmountCents(payment.AmountCents); // 🔥 FIX: "99k VND" for 99,000 cents
                            const status = payment.Status === 0 ? 'Requires Payment' : payment.Status === 2 ? 'Succeeded' : 'Failed';
                            const statusVariant = payment.Status === 2 ? 'success' : payment.Status === 0 ? 'warning' : 'error';
                            return (
                                <TableRow key={payment.Id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-xs font-medium">{payment.UserName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{payment.UserName}</p>
                                                <p className="text-sm text-gray-500">{payment.UserEmail}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{amountVND}</p> {/* 🔥 FIX: "2k VND" for 2000 cents */}
                                    </TableCell>
                                    <TableCell>{payment.PurposeDisplay}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{payment.MembershipPlanName || 'N/A'}</TableCell>
                                    <TableCell>{payment.OrderCode || 'N/A'}</TableCell>
                                    <TableCell>{new Date(payment.CreatedAtUtc).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                                        <button className="text-green-600 hover:text-green-900">Confirm</button>
                                        <button className="text-red-600 hover:text-red-900 ml-2">Cancel</button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-center space-x-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!data?.HasPrevious}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {page} of {totalPages}</span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={!data?.HasNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PaymentsManagement;