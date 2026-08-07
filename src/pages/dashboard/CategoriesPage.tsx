import { useState } from "react";
import { FaEdit, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  type ICategoryResponse,
} from "../../redux/api/categoryApi";

interface CategoryForm {
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  imageFile?: FileList;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

const CategoriesPage: React.FC = () => {
  const { data: categories, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ICategoryResponse | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      isActive: true,
    },
  });

  const openCreate = (): void => {
    setEditing(null);
    reset({ name: "", description: "", image: "", isActive: true });
    setPreview("");
    setModalOpen(true);
  };

  const openEdit = (cat: ICategoryResponse): void => {
    setEditing(cat);
    reset({
      name: cat.name,
      description: cat.description ?? "",
      image: cat.image ?? "",
      isActive: cat.isActive,
    });
    setPreview(cat.image ?? "");
    setModalOpen(true);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const buildPayload = (
    data: CategoryForm,
    fileInput: HTMLInputElement | null
  ): FormData | Record<string, unknown> => {
    const hasFile = fileInput && fileInput.files && fileInput.files.length > 0;
    if (hasFile) {
      const fd = new FormData();
      fd.append("name", data.name.trim());
      if (data.description.trim()) fd.append("description", data.description.trim());
      fd.append("isActive", String(data.isActive));
      fd.append("image", fileInput.files![0]);
      return fd;
    }
    const payload: Record<string, unknown> = {
      name: data.name.trim(),
      description: data.description.trim() || undefined,
      isActive: data.isActive,
    };
    if (data.image.trim()) payload.image = data.image.trim();
    return payload;
  };

  const onSubmit: SubmitHandler<CategoryForm> = async (data) => {
    const fileInput = document.getElementById("category-file") as HTMLInputElement | null;
    const payload = buildPayload(data, fileInput);
    try {
      if (editing) {
        await updateCategory({ id: editing._id, data: payload }).unwrap();
        toast.success("Category updated successfully");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created successfully");
      }
      closeModal();
    } catch (err) {
      const msg =
        (err as { data?: { message?: string; errorMessages?: { message: string }[] } })?.data
          ?.message ??
        (err as { data?: { errorMessages?: { message: string }[] } })?.data?.errorMessages?.[0]
          ?.message ??
        "Failed to save category";
      toast.error(msg);
    }
  };

  const handleDelete = async (cat: ICategoryResponse): Promise<void> => {
    confirmToast(
      {
        title: `Delete category "${cat.name}"?`,
        description: "This cannot be undone.",
      },
      async () => {
        try {
          await deleteCategory(cat._id).unwrap();
          toast.success(`"${cat.name}" deleted successfully`);
        } catch (err) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ?? "Failed to delete category";
          toast.error(msg);
        }
      }
    );
  };

  const filtered = (categories ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const submitting = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-500">
            {(categories ?? []).length} {categories?.length === 1 ? "category" : "categories"} in
            your menu.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => void refetch()}
            disabled={isLoading || isDeleting}
            className="btn-ghost"
          >
            Refresh
          </button>
          <button onClick={openCreate} className="btn-primary">
            <FaPlus size={13} /> Add category
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="input"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No categories yet"
          message="Create your first category to organize your menu."
          action={
            <button onClick={openCreate} className="btn-primary">
              <FaPlus size={13} /> Add category
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((cat) => (
            <div key={cat._id} className="card overflow-hidden">
              <div className="relative h-40 overflow-hidden bg-gray-100">
                <img
                  src={cat.image || FALLBACK_IMAGE}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`badge absolute right-3 top-3 ${
                    cat.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-bold text-gray-900">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wide text-brand">
                      {cat.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      disabled={isUpdating}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      onClick={() => void handleDelete(cat)}
                      disabled={isDeleting}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {cat.description || "No description provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />
          <div className="relative z-10 w-full max-w-lg animate-fade-in">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="card max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">
                    {editing ? "Edit category" : "New category"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {editing
                      ? `Updating "${editing.name}".`
                      : "Fill in the details below to create a new category."}
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
                  <label htmlFor="cat-name" className="label">
                    Name
                  </label>
                  <input
                    id="cat-name"
                    className="input"
                    placeholder="e.g. Burgers"
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  {errors.name && <p className="field-error">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="cat-description" className="label">
                    Description
                  </label>
                  <textarea
                    id="cat-description"
                    rows={3}
                    className="input resize-none"
                    placeholder="A short, catchy description…"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="field-error">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cat-image" className="label">
                    Image URL
                  </label>
                  <input
                    id="cat-image"
                    className="input"
                    placeholder="https://…"
                    {...register("image")}
                    onChange={(e) => {
                      setValue("image", e.target.value);
                      setPreview(e.target.value.trim() || preview);
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Or upload an image below.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div>
                    <label
                      htmlFor="category-file"
                      className="btn-outline cursor-pointer !px-4 !py-2 text-sm"
                    >
                      <FaImage size={14} /> Upload image
                    </label>
                    <input
                      id="category-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden rounded-xl border border-gray-200">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Category preview"
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center text-sm text-gray-400">
                        Preview will appear here
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-brand focus:ring-brand"
                    {...register("isActive")}
                  />
                  Enabled (visible on the menu)
                </label>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={closeModal} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? <Spinner /> : <FaPlus size={13} />}
                  {editing ? "Save changes" : "Create category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
