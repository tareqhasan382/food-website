import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaImage, FaSave, FaUndo } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addFood, updateFood } from "../../redux/foodSlice";
import { categories } from "../../data/data";
import Spinner from "../../components/ui/Spinner";

interface FoodForm {
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  available: boolean;
  featured: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80";

const FoodFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const foods = useAppSelector((state) => state.food);
  const existing = id ? foods.find((f) => f.id === id) : undefined;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FoodForm>({
    defaultValues: {
      name: existing?.name ?? "",
      category: existing?.category ?? categories[0].slug,
      price: existing?.price ?? 9.99,
      description: existing?.description ?? "",
      image: existing?.image ?? "",
      rating: existing?.rating ?? 4.5,
      available: existing?.available ?? true,
      featured: existing?.featured ?? false,
    },
  });

  useEffect(() => {
    if (existing) setPreview(existing.image);
  }, [existing]);

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
      setValue("image", result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit: SubmitHandler<FoodForm> = (data) => {
    setSubmitting(true);
    try {
      const payload = {
        name: data.name.trim(),
        category: data.category,
        price: Number(data.price),
        description: data.description.trim(),
        image: data.image.trim() || FALLBACK_IMAGE,
        rating: Number(data.rating),
        reviews: existing?.reviews ?? 0,
        tags: [data.category],
        available: data.available,
        featured: data.featured,
      };

      if (existing) {
        dispatch(updateFood({ ...payload, id: existing.id }));
        toast.success("Food item updated successfully");
      } else {
        dispatch(addFood({ ...payload, id: `f-${Date.now()}` }));
        toast.success("Food item added to the menu");
      }
      navigate("/dashboard/foods");
    } catch {
      toast.error("Failed to save the food item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">
          {editing ? "Edit food item" : "Add new food"}
        </h2>
        <p className="text-sm text-gray-500">
          {editing
            ? `Updating "${existing?.name}".`
            : "Fill in the details to add a new dish to your menu."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card space-y-5 p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Food name
            </label>
            <input
              id="name"
              className="input"
              placeholder="e.g. Spicy BBQ Burger"
              {...register("name", {
                required: "Food name is required",
                minLength: { value: 3, message: "Name is too short" },
              })}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <select
              id="category"
              className="input capitalize"
              {...register("category", { required: "Category is required" })}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="field-error">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              Price ($)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              className="input"
              placeholder="9.99"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
            />
            {errors.price && (
              <p className="field-error">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rating" className="label">
              Rating (0–5)
            </label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              className="input"
              {...register("rating", {
                valueAsNumber: true,
                min: { value: 0, message: "Minimum 0" },
                max: { value: 5, message: "Maximum 5" },
              })}
            />
            {errors.rating && (
              <p className="field-error">{errors.rating.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="input resize-none"
            placeholder="A short, tasty description…"
            {...register("description", {
              required: "Description is required",
              minLength: { value: 10, message: "Description is too short" },
            })}
          />
          {errors.description && (
            <p className="field-error">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="label">
            Image URL
          </label>
          <input
            id="image"
            className="input"
            placeholder="https://…"
            {...register("image")}
            onChange={(e) => setPreview(e.target.value.trim() || preview)}
          />
          <p className="mt-1 text-xs text-gray-400">
            Paste an image URL or upload a file below.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <label
              htmlFor="file"
              className="btn-outline cursor-pointer !px-4 !py-2 text-sm"
            >
              <FaImage size={14} /> Upload image
            </label>
            <input
              id="file"
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
                alt="Food preview"
                className="h-32 w-full object-cover"
              />
            ) : (
              <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                Image preview will appear here
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              {...register("available")}
            />
            Available
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              {...register("featured")}
            />
            Featured
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={() => navigate("/dashboard/foods")}
            className="btn-ghost"
          >
            <FaUndo size={13} /> Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? <Spinner /> : <FaSave size={14} />}
            {editing ? "Update food" : "Add food"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodFormPage;
