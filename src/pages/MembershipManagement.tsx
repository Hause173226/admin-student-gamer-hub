import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useAuthStore } from "../stores/AuthStore.ts";
import { Plus, Edit, Trash2, X } from "lucide-react";

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

interface MembershipFormData {
  name: string;
  description: string | null;
  monthlyEventLimit: number;
  price: number;
  durationMonths: number;
  isActive: boolean;
}

export function MembershipManagement() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState<MembershipFormData>({
    name: "",
    description: null,
    monthlyEventLimit: 1,
    price: 1,
    durationMonths: 1,
    isActive: true,
  });

  const { data, isLoading, error } = useQuery<
    | MembershipPlan[]
    | {
        Plans?: MembershipPlan[];
        Items?: MembershipPlan[];
        Data?: MembershipPlan[];
      }
  >({
    queryKey: ["memberships"],
    queryFn: () =>
      axiosInstance.get("/admin/dashboard/memberships").then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  // 🔥 FIX: Handle different response structures - ensure plans is always an array
  const plans: MembershipPlan[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.Plans && Array.isArray(data.Plans)) return data.Plans;
    if (data.Items && Array.isArray(data.Items)) return data.Items;
    if (data.Data && Array.isArray(data.Data)) return data.Data;
    console.warn("Unexpected membership data structure:", data);
    return [];
  })();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: MembershipFormData) =>
      axiosInstance.post("/Memberships", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      setIsModalOpen(false);
      resetForm();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      planId,
      data,
    }: {
      planId: string;
      data: MembershipFormData;
    }) => axiosInstance.put(`/Memberships/${planId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      setIsModalOpen(false);
      setSelectedPlan(null);
      resetForm();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (planId: string) =>
      axiosInstance.delete(`/Memberships/${planId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      setIsDeleteModalOpen(false);
      setSelectedPlan(null);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: null,
      monthlyEventLimit: 1,
      price: 1,
      durationMonths: 1,
      isActive: true,
    });
  };

  const handleAdd = () => {
    setSelectedPlan(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    // Convert from cents to VND for display
    const priceInVND = plan.PriceCents / 100;
    console.log("Editing plan:", plan, "Price in VND:", priceInVND); // Debug log
    setFormData({
      name: plan.PlanName,
      description: null,
      monthlyEventLimit:
        plan.MonthlyEventLimit === -1 ? 0 : plan.MonthlyEventLimit,
      price: priceInVND, // Already in VND
      durationMonths: plan.DurationMonths,
      isActive: plan.IsActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      monthlyEventLimit:
        formData.monthlyEventLimit === 0 ? -1 : formData.monthlyEventLimit,
      // API expects price in VND (not cents), so send directly
      price: formData.price,
    };

    console.log("Submitting data:", submitData); // Debug log

    if (selectedPlan) {
      updateMutation.mutate({ planId: selectedPlan.PlanId, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPlan) {
      deleteMutation.mutate(selectedPlan.PlanId);
    }
  };

  if (isLoading)
    return <div className="p-8 text-center">Loading memberships...</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error loading memberships: {error.message}</p>
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Membership Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Managing {plans.length} plans for {user?.name}.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Plan
        </button>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => {
              const priceVND = (plan.PriceCents / 100).toLocaleString("vi-VN"); // 🔥 VND format
              const revenueVND = (plan.TotalRevenueCents / 100).toLocaleString(
                "vi-VN"
              );
              const eventLimit =
                plan.MonthlyEventLimit === -1
                  ? "Unlimited"
                  : plan.MonthlyEventLimit;
              return (
                <TableRow key={plan.PlanId}>
                  <TableCell className="font-medium">{plan.PlanName}</TableCell>
                  <TableCell>{priceVND}</TableCell>
                  <TableCell>{plan.DurationMonths}</TableCell>
                  <TableCell>{eventLimit}</TableCell>
                  <TableCell>
                    <Badge variant={plan.IsActive ? "success" : "error"}>
                      {plan.IsActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{plan.ActiveSubscribers}</TableCell>
                  <TableCell>{revenueVND}</TableCell>
                  <TableCell>{plan.PurchasesThisMonth}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                        disabled={plan.ActiveSubscribers > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedPlan
                  ? "Edit Membership Plan"
                  : "Add New Membership Plan"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPlan(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter plan name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value || null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter description (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (Months) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.durationMonths}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        durationMonths: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monthly Event Limit (0 = Unlimited) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={
                    formData.monthlyEventLimit === -1
                      ? 0
                      : formData.monthlyEventLimit
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyEventLimit: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter 0 for unlimited events
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Active Plan
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedPlan(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending ||
                    updateMutation.isPending ||
                    !formData.name.trim()
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedPlan
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Delete Membership Plan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete the plan{" "}
                <strong>{selectedPlan.PlanName}</strong>?
              </p>
              {selectedPlan.ActiveSubscribers > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ This plan has {selectedPlan.ActiveSubscribers} active
                    subscribers. Deleting it may affect existing memberships.
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPlan(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembershipManagement;
