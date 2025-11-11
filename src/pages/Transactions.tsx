import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { formatAmountCents } from '../utils/formatCurrency'; // Import formatter

interface TransactionItem {
    Id: string;
    WalletId: string;
    UserId: string;
    UserName: string;
    UserEmail: string;
    AmountCents: number;
    Currency: string;
    Direction: number;
    Method: number;
    Status: number;
    EventId?: string;
    EventTitle?: string;
    Provider: string;
    ProviderRef?: string;
    Metadata: string;
    CreatedAtUtc: string;
    CompletedAtUtc?: string;
}

interface TransactionsResponse {
    Items: TransactionItem[];
    Page: number;
    Size: number;
    TotalCount: number;
    TotalPages: number;
    HasPrevious: boolean;
    HasNext: boolean;
    Sort: string;
    Desc: boolean;
}

export function Transactions() {
    const { user } = useAuthStore();
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery<TransactionsResponse>({
        queryKey: ['transactions', page],
        queryFn: () => axiosInstance.get(`/admin/dashboard/transactions?page=${page}&size=20`).then(res => res.data),
        keepPreviousData: true,
    });

    const transactions = data?.Items || [];
    const totalPages = data?.TotalPages || 1;

    if (isLoading) return <div className="p-8 text-center">Loading transactions...</div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <p>Error loading transactions: {error.message}</p>
            <button onClick={() => location.reload()} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
                    <p className="text-gray-600 dark:text-gray-400">Managing {data?.TotalCount || 0} transactions. Page {page} of {totalPages}.</p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Amount (VND)</TableHead> {/* 🔥 FIX: VND header */}
                            <TableHead>Direction</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((tx) => {
                            const amountVND = formatAmountCents(tx.AmountCents); // 🔥 FIX: "99k VND" for 99,000 cents
                            const direction = tx.Direction === 1 ? 'In' : 'Out';
                            const status = tx.Status === 1 ? 'Success' : 'Failed';
                            const type = JSON.parse(tx.Metadata || '{}').note || 'Unknown';
                            return (
                                <TableRow key={tx.Id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-xs font-medium">{tx.UserName.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{tx.UserName}</p>
                                                <p className="text-sm text-gray-500">{tx.UserEmail}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="font-medium">{amountVND}</p> {/* 🔥 FIX: "2k VND" for 2000 cents */}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={tx.Direction === 1 ? 'success' : 'warning'}>
                                            {direction}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{tx.Method === 0 ? 'Local' : tx.Method === 2 ? 'PAYOS' : 'Other'}</TableCell>
                                    <TableCell className="font-medium">{tx.Provider}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.Status === 1 ? 'success' : 'error'}>
                                            {status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{type}</TableCell>
                                    <TableCell>{new Date(tx.CreatedAtUtc).toLocaleDateString()}</TableCell>
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

export default Transactions;