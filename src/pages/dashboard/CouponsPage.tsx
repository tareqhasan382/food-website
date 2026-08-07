import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaPlus,
  FaPowerOff,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Select from "../../components/ui/Select";
import {
  useCreateCouponMutation,
  useDeleteCouponMutation,
  useGetAdminCouponsQuery,
  useUpdateCouponMutation,
} from "../../redux/api/couponApi";
import { formatCurrency } from "../../components/charts/chart-utils";
import type { AdminCoupon, CouponType } from "../../types/admin";

const PAGE_SIZE = 10;

interface CouponForm {
  code: string;
  type: CouponType;
  value: number;
  expiryDate: string;
  usageLimit: number;
  minimumOrder: number;
  isActive: boolean;
}

const toDateInput = (value?: string): string =>
  value ? value.slice(0, 10) : "";

const formatDate = (value?: string): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CouponsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [active, setActive] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);

  const args = useMemo(
    () => ({
      searchTerm: search.trim() || undefined,
      type: type || undefined,
      isActive: active || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [search, type, active, page]
  );

  const { data, isFetching, isLoading, refetch } = useGetAdminCouponsQuery(
    args,
    { refetchOnMountOrArgChange: true }
  );
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const coupons = data?.coupons ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CouponForm>({
    defaultValues: {
      code: "",
      type: "percentage",
      value: 0,
      expiryDate: "",
      usageLimit: 100,
      minimumOrder: 0,
      isActive: true,
    },
  });

  const formType = watch("type");
  const formValue = watch("value") || 0;

  const openCreate = (): void => {
    setEditing(null);
    reset({
      code: "",
      type: "percentage",
      value: 0,
      expiryDate: "",
      usageLimit: 100,
      minimumOrder: 0,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (coupon: AdminCoupon): void => {
    setEditing(coupon);
    reset({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      expiryDate: toDateInput(coupon.expiryDate),
      usageLimit: coupon.usageLimit,
      minimumOrder: coupon.minimumOrder ?? 0,
      isActive: coupon.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setEditing(null);
  };

  const onSubmit: SubmitHandler<CouponForm> = async (data) => {
    const payload = {
      code: data.code.trim(),
      type: data.type,
      value: Number(data.value),
      expiryDate: data.expiryDate,
      usageLimit: Number(data.usageLimit),
      minimumOrder: Number(data.minimumOrder),
      isActive: data.isActive,
    };
    try {
      if (editing) {
        await updateCoupon({ id: editing._id, data: payload }).unwrap();
        toast.success("Coupon updated successfully");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Coupon created successfully");
      }
      closeModal();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string; errorMessages?: { message: string }[] } })?.data
          ?.message ??
        (err as { data?: { errorMessages?: { message: string }[] } })?.data?.errorMessages?.[0]
          ?.message ??
        "Failed to save coupon";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (coupon: AdminCoupon): Promise<void> => {
    try {
      await updateCoupon({
        id: coupon._id,
        data: { isActive: !coupon.isActive },
      }).unwrap();
      toast.success(`${coupon.code} ${coupon.isActive ? "disabled" : "enabled"}`);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update coupon";
      toast.error(msg);
    }
  };

  const handleDelete = async (coupon: AdminCoupon): Promise<void> => {
    confirmToast(
      {
        title: `Delete coupon "${coupon.code}"?`,
        description: "This cannot be undone.",
      },
      async () => {
        try {
          await deleteCoupon(coupon._id).unwrap();
          toast.success(`${coupon.code} deleted successfully`);
          if (coupons.length === 1 && page > 1) {
            setPage((p) => Math.max(1, p - 1));
          }
        } catch (err) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Failed to delete coupon";
          toast.error(msg);
        }
      }
    );
  };

  const submitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Coupons
          </h2>
          <p className="text-sm text-gray-500">
            {meta?.total ?? coupons.length} promo codes available.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void refetch()}
            disabled={isFetching}
            className="btn-ghost"
          >
            Refresh
          </button>
          <button onClick={openCreate} className="btn-primary">
            <FaPlus size={13} /> New coupon
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by code…"
            className="input pl-9"
          />
        </div>
        <Select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="sm:w-44"
          aria-label="Filter by type"
          options={[
            { value: "", label: "All types" },
            { value: "percentage", label: "Percentage" },
            { value: "fixed", label: "Fixed amount" },
          ]}
        />
        <Select
          value={active}
          onChange={(e) => {
            setActive(e.target.value);
            setPage(1);
          }}
          className="sm:w-44"
          aria-label="Filter by status"
          options={[
            { value: "", label: "All statuses" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
        />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No coupons found"
              message="Create a promo code to start offering discounts."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <FaPlus size={13} /> New coupon
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">Code</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Discount</th>
                  <th className="px-5 py-3 font-semibold">Min order</th>
                  <th className="px-5 py-3 font-semibold">Usage</th>
                  <th className="px-5 py-3 font-semibold">Expires</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <span className="font-mono text-sm font-bold text-brand">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-3 capitalize text-gray-600">
                      {coupon.type}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {coupon.type === "percentage"
                        ? `${coupon.value}%`
                        : formatCurrency(coupon.value)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {coupon.minimumOrder > 0
                        ? formatCurrency(coupon.minimumOrder)
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      <span className="font-semibold">{coupon.usedCount}</span>
                      {" / "}
                      {coupon.usageLimit}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(coupon.expiryDate)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          coupon.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => void handleToggleActive(coupon)}
                          disabled={isUpdating}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            coupon.isActive
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-green-600 hover:bg-green-50"
                          } disabled:opacity-60`}
                          aria-label={
                            coupon.isActive
                              ? `Disable ${coupon.code}`
                              : `Enable ${coupon.code}`
                          }
                        >
                          <FaPowerOff size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(coupon)}
                          disabled={isUpdating}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${coupon.code}`}
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          onClick={() => void handleDelete(coupon)}
                          disabled={isDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60"
                          aria-label={`Delete ${coupon.code}`}
                        >
                          <FaTrash size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isFetching}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            <FaChevronLeft size={12} /> Prev
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {totalPages}
            {meta?.total !== undefined && ` · ${meta.total} total`}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isFetching}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            Next <FaChevronRight size={12} />
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg animate-fade-in">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    {editing ? "Edit coupon" : "New coupon"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {editing
                      ? `Updating "${editing.code}".`
                      : "Create a promo code your customers can redeem."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="Close"
                >
                  <MdClose size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="coupon-code" className="label">
                    Code
                  </label>
                  <input
                    id="coupon-code"
                    className="input uppercase"
                    placeholder="e.g. WELCOME10"
                    disabled={Boolean(editing)}
                    {...register("code", {
                      required: "Code is required",
                      minLength: { value: 3, message: "At least 3 characters" },
                      maxLength: { value: 20, message: "At most 20 characters" },
                    })}
                  />
                  {errors.code && (
                    <p className="field-error">{errors.code.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="coupon-type" className="label">
                      Type
                    </label>
                    <Select
                      id="coupon-type"
                      {...register("type", { required: "Type is required" })}
                      options={[
                        { value: "percentage", label: "Percentage (%)" },
                        { value: "fixed", label: "Fixed amount ($)" },
                      ]}
                    />
                  </div>
                  <div>
                    <label htmlFor="coupon-value" className="label">
                      {formType === "percentage" ? "Discount (%)" : "Discount ($)"}
                    </label>
                    <input
                      id="coupon-value"
                      type="number"
                      step="any"
                      min="0"
                      className="input"
                      {...register("value", {
                        required: "Discount is required",
                        min: {
                          value: 0.01,
                          message: "Must be greater than 0",
                        },
                        validate: (v) =>
                          formType !== "percentage" ||
                          v <= 100 ||
                          "Percentage must be at most 100",
                      })}
                    />
                    {errors.value && (
                      <p className="field-error">{errors.value.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="coupon-expiry" className="label">
                      Expires on
                    </label>
                    <input
                      id="coupon-expiry"
                      type="date"
                      className="input"
                      {...register("expiryDate", {
                        required: "Expiry date is required",
                      })}
                    />
                    {errors.expiryDate && (
                      <p className="field-error">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="coupon-usage" className="label">
                      Usage limit
                    </label>
                    <input
                      id="coupon-usage"
                      type="number"
                      step="1"
                      min="1"
                      className="input"
                      {...register("usageLimit", {
                        required: "Usage limit is required",
                        min: {
                          value: 1,
                          message: "Must be at least 1",
                        },
                        valueAsNumber: true,
                      })}
                    />
                    {errors.usageLimit && (
                      <p className="field-error">{errors.usageLimit.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="coupon-minorder" className="label">
                    Minimum order (optional)
                  </label>
                  <input
                    id="coupon-minorder"
                    type="number"
                    step="any"
                    min="0"
                    className="input"
                    {...register("minimumOrder", {
                      min: { value: 0, message: "Cannot be negative" },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.minimumOrder && (
                    <p className="field-error">{errors.minimumOrder.message}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-brand focus:ring-brand"
                      {...register("isActive")}
                    />
                    Active
                  </label>
                  <span className="text-xs text-gray-500">
                    {formType === "percentage"
                      ? `This coupon saves ${formValue}% of the order total.`
                      : `This coupon saves ${formatCurrency(formValue)} on qualifying orders.`}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={closeModal} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? <Spinner /> : <FaPlus size={13} />}
                  {editing ? "Save changes" : "Create coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
