import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  FaEdit,
  FaPlus,
  FaPowerOff,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  useCreatePromotionMutation,
  useDeletePromotionMutation,
  useGetAllPromotionsQuery,
  useUpdatePromotionMutation,
} from "../../redux/api/promotionApi";
import type { IPromotion } from "../../types/promotion";

interface PromotionForm {
  title: string;
  subtitle: string;
  badge: string;
  validUntil: string;
  image: string;
  isActive: boolean;
}

const PromotionsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<IPromotion | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAllPromotionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createPromotion, { isLoading: isCreating }] = useCreatePromotionMutation();
  const [updatePromotion, { isLoading: isUpdating }] = useUpdatePromotionMutation();
  const [deletePromotion, { isLoading: isDeleting }] = useDeletePromotionMutation();

  const promotions = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (promo) =>
        promo.title.toLowerCase().includes(q) ||
        (promo.badge ?? "").toLowerCase().includes(q) ||
        (promo.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [data, search]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PromotionForm>({
    defaultValues: {
      title: "",
      subtitle: "",
      badge: "",
      validUntil: "",
      image: "",
      isActive: true,
    },
  });

  const openCreate = (): void => {
    setEditing(null);
    reset({
      title: "",
      subtitle: "",
      badge: "",
      validUntil: "",
      image: "",
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (promo: IPromotion): void => {
    setEditing(promo);
    reset({
      title: promo.title,
      subtitle: promo.subtitle ?? "",
      badge: promo.badge ?? "",
      validUntil: promo.validUntil ?? "",
      image: promo.image ?? "",
      isActive: promo.isActive,
    });
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setEditing(null);
  };

  const onSubmit: SubmitHandler<PromotionForm> = async (formData) => {
    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || undefined,
      badge: formData.badge.trim() || undefined,
      validUntil: formData.validUntil.trim() || undefined,
      image: formData.image.trim() || undefined,
      isActive: formData.isActive,
    };
    try {
      if (editing) {
        await updatePromotion({ id: editing._id, data: payload }).unwrap();
        toast.success("Promotion updated successfully");
      } else {
        await createPromotion(payload).unwrap();
        toast.success("Promotion created successfully");
      }
      closeModal();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string; errorMessages?: { message: string }[] } })?.data
          ?.message ??
        (err as { data?: { errorMessages?: { message: string }[] } })?.data?.errorMessages?.[0]
          ?.message ??
        "Failed to save promotion";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (promo: IPromotion): Promise<void> => {
    try {
      await updatePromotion({
        id: promo._id,
        data: { isActive: !promo.isActive },
      }).unwrap();
      toast.success(`${promo.title} ${promo.isActive ? "disabled" : "enabled"}`);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to update promotion";
      toast.error(msg);
    }
  };

  const handleDelete = async (promo: IPromotion): Promise<void> => {
    const confirmed = window.confirm(
      `Delete promotion "${promo.title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deletePromotion(promo._id).unwrap();
      toast.success(`${promo.title} deleted successfully`);
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete promotion";
      toast.error(msg);
    }
  };

  const submitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Promotions
          </h2>
          <p className="text-sm text-gray-500">
            {promotions.length} banner{" "}
            {promotions.length === 1 ? "card" : "cards"} on the homepage.
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
            <FaPlus size={13} /> New promotion
          </button>
        </div>
      </div>

      <div className="relative sm:max-w-sm">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="input pl-9"
        />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No promotions found"
              message="Create a promotion banner to feature it on the homepage."
              action={
                <button onClick={openCreate} className="btn-primary">
                  <FaPlus size={13} /> New promotion
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">Banner</th>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Badge</th>
                  <th className="px-5 py-3 font-semibold">Valid until</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {promotions.map((promo) => (
                  <tr key={promo._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <img
                        src={promo.image ?? ""}
                        alt={promo.title}
                        className="h-12 w-20 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {promo.title}
                      {promo.subtitle && (
                        <p className="mt-0.5 max-w-xs truncate text-xs font-normal text-gray-500">
                          {promo.subtitle}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {promo.badge ? (
                        <span className="badge bg-brand text-white">
                          {promo.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {promo.validUntil ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          promo.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => void handleToggleActive(promo)}
                          disabled={isUpdating}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            promo.isActive
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-green-600 hover:bg-green-50"
                          } disabled:opacity-60`}
                          aria-label={
                            promo.isActive
                              ? `Disable ${promo.title}`
                              : `Enable ${promo.title}`
                          }
                        >
                          <FaPowerOff size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(promo)}
                          disabled={isUpdating}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${promo.title}`}
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          onClick={() => void handleDelete(promo)}
                          disabled={isDeleting}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60"
                          aria-label={`Delete ${promo.title}`}
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
                    {editing ? "Edit promotion" : "New promotion"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {editing
                      ? `Updating "${editing.title}".`
                      : "Create a banner card shown on the homepage."}
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
                  <label htmlFor="promo-title" className="label">
                    Title
                  </label>
                  <input
                    id="promo-title"
                    className="input"
                    placeholder="e.g. Burger Weekend"
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 2,
                        message: "At least 2 characters",
                      },
                    })}
                  />
                  {errors.title && (
                    <p className="field-error">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="promo-subtitle" className="label">
                    Subtitle (optional)
                  </label>
                  <input
                    id="promo-subtitle"
                    className="input"
                    placeholder="e.g. 20% off all smash burgers"
                    {...register("subtitle")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="promo-badge" className="label">
                      Badge (optional)
                    </label>
                    <input
                      id="promo-badge"
                      className="input"
                      placeholder="e.g. Limited time"
                      {...register("badge")}
                    />
                  </div>
                  <div>
                    <label htmlFor="promo-valid" className="label">
                      Valid until (optional)
                    </label>
                    <input
                      id="promo-valid"
                      className="input"
                      placeholder="e.g. Valid till Dec 2026"
                      {...register("validUntil")}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="promo-image" className="label">
                    Image URL (optional)
                  </label>
                  <input
                    id="promo-image"
                    type="url"
                    className="input"
                    placeholder="https://…"
                    {...register("image")}
                  />
                  {errors.image && (
                    <p className="field-error">{errors.image.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm">
                  <label className="flex items-center gap-2 font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-brand focus:ring-brand"
                      {...register("isActive")}
                    />
                    Active
                  </label>
                  <span className="text-xs text-gray-500">
                    Active banners appear on the homepage.
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={closeModal} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? <Spinner /> : <FaPlus size={13} />}
                  {editing ? "Save changes" : "Create promotion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
