import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaImage, FaPlus, FaSave, FaTrash, FaUndo } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../../components/ui/Spinner";
import ErrorState from "../../components/ui/ErrorState";
import Select from "../../components/ui/Select";
import {
  useCreateFoodMutation,
  useGetFoodQuery,
  useUpdateFoodMutation,
} from "../../redux/api/foodApi";
import { useCategories } from "../../hooks/useCategories";
import type { FoodCategory, IFood } from "../../types/food";
import { foodImage } from "../../utils/food-image";
import { FaXmark } from "react-icons/fa6";

interface FoodForm {
  name: string;
  description: string;
  category: FoodCategory;
  price: number;
  discountPrice?: number;
  stock: number;
  images: { url: string }[];
  ingredients: { value: string }[];
  preparationTime: number;
  calories: number;
  rating: number;
  availability: boolean;
  newImages?: FileList;
}

const MAX_IMAGES = 10;

const parseIngredients = (food?: IFood): { value: string }[] => {
  if (!food?.ingredients || !Array.isArray(food.ingredients))
    return [{ value: "" }];
  const arr = food.ingredients.filter((i) => typeof i === "string" && i.length > 0);
  return arr.length > 0 ? arr.map((v) => ({ value: v })) : [{ value: "" }];
};

const parseImages = (food?: IFood): { url: string }[] => {
  if (!food?.images || !Array.isArray(food.images))
    return [{ url: "" }];
  const arr = food.images.filter((i) => typeof i === "string" && i.length > 0);
  return arr.length > 0 ? arr.map((url) => ({ url })) : [{ url: "" }];
};

const FoodFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const {
    data: existing,
    isLoading: isFetchingFood,
    isError,
    refetch,
  } = useGetFoodQuery(id ?? "", {
    skip: !editing,
    refetchOnMountOrArgChange: true,
  });

  const [createFood, { isLoading: isCreating }] = useCreateFoodMutation();
  const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FoodForm>({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: 9.99,
      discountPrice: undefined,
      stock: 50,
      images: [{ url: "" }],
      ingredients: [{ value: "" }],
      preparationTime: 15,
      calories: 500,
      rating: 4.5,
      availability: true,
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } =
    useFieldArray({ control, name: "images" });
  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const [uploadPreview, setUploadPreview] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>("");

  const watchedImages = watch("images");
  const watchedPrice = watch("price");
  const watchedDiscount = watch("discountPrice");

  useEffect(() => {
    if (!editing && categories.length > 0 && !getValues("category")) {
      setValue("category", categories[0].slug, { shouldValidate: true });
    }
  }, [editing, categories, setValue, getValues]);

  useEffect(() => {
    if (editing && existing) {
      reset({
        name: existing.name,
        description: existing.description,
        category: existing.category,
        price: Number(existing.price),
        discountPrice:
          existing.discountPrice !== undefined
            ? Number(existing.discountPrice)
            : undefined,
        stock: Number(existing.stock),
        images: parseImages(existing),
        ingredients: parseIngredients(existing),
        preparationTime: Number(existing.preparationTime) || 15,
        calories: Number(existing.calories) || 0,
        rating: Number(existing.rating) || 0,
        availability: Boolean(existing.availability),
      });
      setUploadPreview([]);
    } else if (!editing) {
      setUploadPreview([]);
    }
  }, [editing, existing, reset]);

  const allImageUrls = useMemo(() => {
    const fromForm = (watchedImages ?? []).map((i) => i.url).filter(Boolean);
    return [...uploadPreview, ...fromForm];
  }, [watchedImages, uploadPreview]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const totalAfter = allImageUrls.length + files.length;
    if (totalAfter > MAX_IMAGES) {
      toast.error(`You can have at most ${MAX_IMAGES} images. Remove some first.`);
      e.target.value = "";
      return;
    }
    const previews: string[] = [];
    let loaded = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Image "${file.name}" is too large. Max 2MB.`);
        continue;
      }
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        loaded++;
        if (loaded === files.length) {
          setUploadPreview((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const clearUploadPreviews = (): void => {
    setUploadPreview([]);
    const fileInput = document.getElementById("food-file") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
  };

  const buildPayload = (
    data: FoodForm,
    fileInput: HTMLInputElement | null
  ): FormData | Record<string, unknown> => {
    const hasFiles =
      fileInput && fileInput.files && fileInput.files.length > 0;
    const cleanImages = (data.images ?? [])
      .map((i) => i.url.trim())
      .filter(Boolean);

    const base: Record<string, unknown> = {
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      price: Number(data.price),
      stock: Number(data.stock),
      preparationTime: Number(data.preparationTime) || undefined,
      calories: Number(data.calories) || 0,
      rating: Number(data.rating),
      availability: data.availability,
    };
    if (data.discountPrice !== undefined && data.discountPrice !== null) {
      base.discountPrice = Number(data.discountPrice);
    }
    const ingredients = (data.ingredients ?? [])
      .map((i) => i.value.trim())
      .filter(Boolean);
    if (ingredients.length > 0) base.ingredients = ingredients;

    if (hasFiles) {
      const fd = new FormData();
      Object.entries(base).forEach(([k, v]) => {
        if (v === undefined) return;
        if (Array.isArray(v)) {
          v.forEach((item, idx) => fd.append(`${k}[${idx}]`, String(item)));
        } else {
          fd.append(k, v as string | Blob);
        }
      });
      if (cleanImages.length > 0) {
        cleanImages.forEach((url, idx) =>
          fd.append(`images[${idx}]`, url)
        );
      }
      for (let i = 0; i < fileInput.files!.length; i++) {
        fd.append(`images`, fileInput.files![i]);
      }
      return fd;
    }

    if (cleanImages.length > 0) base.images = cleanImages;
    return base;
  };

  const onSubmit: SubmitHandler<FoodForm> = async (data) => {
    setSubmitError("");
    if (
      data.discountPrice !== undefined &&
      data.discountPrice !== null &&
      data.discountPrice >= Number(data.price)
    ) {
      setSubmitError("Discount price must be less than the regular price.");
      return;
    }
    const fileInput = document.getElementById("food-file") as HTMLInputElement | null;
    const payload = buildPayload(data, fileInput);
    try {
      if (editing && id) {
        await updateFood({ id, data: payload }).unwrap();
        toast.success("Food item updated successfully");
      } else {
        await createFood(payload).unwrap();
        toast.success("Food item added to the menu");
      }
      navigate("/dashboard/foods");
    } catch (err) {
      const e = err as {
        data?: { message?: string; errorMessages?: { message: string }[] };
      };
      const msg =
        e.data?.message ?? e.data?.errorMessages?.[0]?.message ??
        "Failed to save the food item. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  const submitting = isCreating || isUpdating;

  if (editing && isFetchingFood) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (editing && isError) {
    return (
      <ErrorState
        title="Couldn't load this dish"
        message="We hit a snag while fetching this food item."
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
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
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="label">
              Food name
            </label>
            <input
              id="name"
              className="input"
              placeholder="e.g. Spicy BBQ Burger"
              {...register("name", {
                required: "Food name is required",
                minLength: { value: 2, message: "Name is too short" },
                maxLength: { value: 100, message: "Name is too long" },
              })}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <Select
              id="category"
              selectClassName="capitalize"
              {...register("category", { required: "Category is required" })}
            >
              <option value="" disabled>
                {categoriesLoading ? "Loading categories…" : "Select a category"}
              </option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug} className="capitalize">
                  {cat.name}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="field-error">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="label">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              step="1"
              min="0"
              className="input"
              placeholder="50"
              {...register("stock", {
                required: "Stock is required",
                valueAsNumber: true,
                min: { value: 0, message: "Stock cannot be negative" },
              })}
            />
            {errors.stock && <p className="field-error">{errors.stock.message}</p>}
          </div>

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
            {errors.price && <p className="field-error">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="discountPrice" className="label">
              Discount price ($) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="discountPrice"
              type="number"
              step="0.01"
              min="0"
              className="input"
              placeholder="Leave empty for no discount"
              {...register("discountPrice", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
                validate: (v) =>
                  v === undefined || v === null || v < Number(watchedPrice) ||
                  "Must be less than regular price",
              })}
            />
            {errors.discountPrice && (
              <p className="field-error">{errors.discountPrice.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="preparationTime" className="label">
              Preparation time (min)
            </label>
            <input
              id="preparationTime"
              type="number"
              step="1"
              min="1"
              className="input"
              placeholder="15"
              {...register("preparationTime", {
                valueAsNumber: true,
                min: { value: 1, message: "Minimum 1 minute" },
              })}
            />
            {errors.preparationTime && (
              <p className="field-error">{errors.preparationTime.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="calories" className="label">
              Calories
            </label>
            <input
              id="calories"
              type="number"
              step="1"
              min="0"
              className="input"
              placeholder="500"
              {...register("calories", {
                valueAsNumber: true,
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            {errors.calories && (
              <p className="field-error">{errors.calories.message}</p>
            )}
          </div>

          <div className="sm:col-span-2">
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
              placeholder="4.5"
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

          <div className="sm:col-span-2">
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
                maxLength: { value: 2000, message: "Description is too long" },
              })}
            />
            {errors.description && (
              <p className="field-error">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-gray-900">
              Ingredients
            </h3>
            <button
              type="button"
              onClick={() => appendIngredient({ value: "" })}
              className="text-xs font-semibold text-brand hover:underline"
            >
              + Add ingredient
            </button>
          </div>
          <div className="space-y-2">
            {ingredientFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder={`Ingredient ${idx + 1} (e.g. Fresh basil)`}
                  {...register(`ingredients.${idx}.value`)}
                />
                {ingredientFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                    aria-label={`Remove ingredient ${idx + 1}`}
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-gray-900">
              Images
            </h3>
            <span className="text-xs font-medium text-gray-500">
              {allImageUrls.length}/{MAX_IMAGES}
            </span>
          </div>

          {allImageUrls.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {uploadPreview.map((src, i) => (
                <div
                  key={`upload-${i}`}
                  className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200"
                >
                  <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  <span className="badge absolute left-2 top-2 bg-brand text-white">New</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUploadPreview((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove uploaded image"
                  >
                    <FaXmark size={14} />
                  </button>
                </div>
              ))}
              {imageFields.map((field, idx) => {
                const url = watchedImages?.[idx]?.url;
                if (!url) return null;
                return (
                  <div
                    key={field.id}
                    className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200"
                  >
                    <img
                      src={url}
                      alt={`Image ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {imageFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          removeImage(idx);
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <FaXmark size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {editing && existing && (
            <div className="mb-3 overflow-hidden rounded-xl ring-1 ring-gray-200">
              <img
                src={foodImage(existing)}
                alt="Current main image"
                className="h-32 w-full object-cover"
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-[auto,1fr] sm:items-center">
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor="food-file"
                className="btn-outline cursor-pointer !px-4 !py-2 text-sm"
              >
                <FaImage size={14} /> Upload image
              </label>
              <input
                id="food-file"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFile}
                className="hidden"
              />
              {uploadPreview.length > 0 && (
                <button
                  type="button"
                  onClick={clearUploadPreviews}
                  className="btn-ghost !px-4 !py-2 text-sm"
                >
                  Clear uploads
                </button>
              )}
              {allImageUrls.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={() => appendImage({ url: "" })}
                  className="btn-ghost !px-4 !py-2 text-sm"
                >
                  <FaPlus size={12} /> Image URL
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {imageFields.map((field, idx) => (
              <div key={field.id} className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder={`Image URL ${idx + 1} (https://…)`}
                  {...register(`images.${idx}.url`)}
                />
                {imageFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50"
                    aria-label={`Remove image URL ${idx + 1}`}
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Upload images or paste URLs. At least one image is required.
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 accent-brand focus:ring-brand"
              {...register("availability")}
            />
            Available for ordering
          </label>
        </div>

        {/* Discount / price warning */}
        {watchedDiscount !== undefined &&
          watchedDiscount !== null &&
          watchedDiscount >= Number(watchedPrice) && (
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              Discount price must be lower than the regular price.
            </div>
          )}

        {submitError && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
            {submitError}
          </div>
        )}

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
