import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance.ts';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/AuthStore.ts';

interface MembershipPlan {
    PlanId: string;
    PlanName: string;
    PriceCents: number;
    DurationMonths: number;
    MonthlyEventLimit: number;
    IsActive: boolean;
    ActiveSubscribers: number;
    TotalRevenueCents: number;
    PurchasesThisMonth: number;
}

export function MembershipManagement() {
    const { user } = useAuthStore();

    const { data, isLoading, error } = useQuery<MembershipPlan[]>({ // 🔥 FIX: Type as direct array, not wrapper
        queryKey: ['memberships'],
        queryFn: () => axiosInstance.get('/admin/dashboard/memberships').then(res => res.data), // Returns array directly
        staleTime: 5 * 60 * 1000,
    });

    // 🔥 FIX: Direct array – no .Plans wrapper
    const plans = data || [];

    // 🔥 FIX: Debug log – Verify data in console
    console.log('Membership data:', data); // Should log the 4 plans array

    if (isLoading) return <div className="p-8 text-center">Loading memberships...</div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <p>Error loading memberships: {error.message}</p>
            <button onClick={() => location.reload()} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Membership Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Managing {plans.length} plans for {user?.name}.</p> {/* 🔥 FIX: plans.length = 4 */}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Plan Name</TableHead>
                            <TableHead>Price (VND)</TableHead>
                            <TableHead>Duration (Months)</TableHead>
                            <TableHead>Event Limit</TableHead>
                            <TableHead>Active?</TableHead>
                            <TableHead>Active Subscribers</TableHead>
                            <TableHead>Total Revenue (VND)</TableHead>
                            <TableHead>Purchases This Month</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.map((plan) => {
                            const priceVND = (plan.PriceCents / 100).toLocaleString('vi-VN'); // 🔥 VND format
                            const revenueVND = (plan.TotalRevenueCents / 100).toLocaleString('vi-VN');
                            const eventLimit = plan.MonthlyEventLimit === -1 ? 'Unlimited' : plan.MonthlyEventLimit;
                            return (
                                <TableRow key={plan.PlanId}>
                                    <TableCell className="font-medium">{plan.PlanName}</TableCell>
                                    <TableCell>{priceVND}</TableCell>
                                    <TableCell>{plan.DurationMonths}</TableCell>
                                    <TableCell>{eventLimit}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.IsActive ? 'success' : 'error'}>
                                            {plan.IsActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{plan.ActiveSubscribers}</TableCell>
                                    <TableCell>{revenueVND}</TableCell>
                                    <TableCell>{plan.PurchasesThisMonth}</TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default MembershipManagement;