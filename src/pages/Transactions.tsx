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
import { formatAmountCents } from "../utils/formatCurrency"; // Import formatter

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
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useQuery<TransactionsResponse>(
    {
      queryKey: ["transactions", page],
      queryFn: () =>
        axiosInstance
          .get(`/admin/dashboard/transactions?page=${page}&size=20`)
          .then((res) => res.data),
      placeholderData: keepPreviousData,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      refetchOnWindowFocus: false, // Don't refetch when switching tabs
      refetchOnMount: false, // Don't refetch on mount if data exists
    }
  );

  const transactions = data?.Items || [];
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
                <TableHead className="w-16">STT</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount (VND)</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={10} columns={9} />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading transactions: {error.message}</p>
        <button
          onClick={() => location.reload()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transaction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Managing {data?.TotalCount || 0} transactions.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">STT</TableHead>
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
            {isFetching ? (
              <TableSkeleton rows={10} columns={9} />
            ) : (
              transactions.map((tx, index) => {
                const amountVND = formatAmountCents(tx.AmountCents); // 🔥 FIX: "99k VND" for 99,000 cents
                const direction = tx.Direction === 1 ? "In" : "Out";
                const status = tx.Status === 1 ? "Success" : "Failed";
                const type = JSON.parse(tx.Metadata || "{}").note || "Unknown";
                // Calculate STT: (page - 1) * pageSize + index + 1
                const stt = (page - 1) * 20 + index + 1;
                return (
                  <TableRow key={tx.Id}>
                    <TableCell className="text-center font-medium text-gray-500 dark:text-gray-400">
                      {stt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {tx.UserName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{tx.UserName}</p>
                          <p className="text-sm text-gray-500">
                            {tx.UserEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{amountVND}</p>{" "}
                      {/* 🔥 FIX: "2k VND" for 2000 cents */}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.Direction === 1 ? "success" : "warning"}
                      >
                        {direction}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.Method === 0
                        ? "Local"
                        : tx.Method === 2
                        ? "PAYOS"
                        : "Other"}
                    </TableCell>
                    <TableCell className="font-medium">{tx.Provider}</TableCell>
                    <TableCell>
                      <Badge variant={tx.Status === 1 ? "success" : "error"}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>
                      {new Date(tx.CreatedAtUtc).toLocaleDateString()}
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
          Page {page} of {totalPages}
        </span>
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

export default Transactions;
