import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { confirmToast } from "../../utils/confirmToast";
import EmptyState from "../../components/ui/EmptyState";
import Spinner from "../../components/ui/Spinner";
import Select from "../../components/ui/Select";
import CategoryLabel from "../../components/category/CategoryLabel";
import {
  useDeleteFoodMutation,
  useGetFoodsQuery,
} from "../../redux/api/foodApi";
import { useCategories } from "../../hooks/useCategories";
import type { IGetFoodsArgs } from "../../types/food";
import { foodImage } from "../../utils/food-image";

const PAGE_SIZE = 10;

const FoodsPage: React.FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  const args: IGetFoodsArgs = useMemo(
    () => ({
      searchTerm: search.trim() || undefined,
      category: category || undefined,
      page,
      limit: PAGE_SIZE,
      sortBy: "newest",
    }),
    [search, category, page]
  );

  const { data, isFetching, isLoading, refetch } = useGetFoodsQuery(args, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteFood, { isLoading: isDeleting }] = useDeleteFoodMutation();

  const foods = data?.foods ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(foods.length / PAGE_SIZE));

  const handleDelete = async (id: string, name: string): Promise<void> => {
    confirmToast(
      { title: `Delete "${name}" from the menu?`, description: "This cannot be undone." },
      async () => {
        try {
          await deleteFood(id).unwrap();
          toast.success(`${name} deleted successfully`);
          if (foods.length === 1 && page > 1) {
            setPage((p) => Math.max(1, p - 1));
          }
        } catch (err) {
          const msg =
            (err as { data?: { message?: string } })?.data?.message ??
            "Failed to delete food item";
          toast.error(msg);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">All Foods</h2>
          <p className="text-sm text-gray-500">
            {meta?.total ?? foods.length} items in your menu.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => void refetch()} disabled={isFetching} className="btn-ghost">
            Refresh
          </button>
          <button onClick={() => navigate("/dashboard/foods/new")} className="btn-primary">
            <FaPlus size={13} /> Add food
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
            placeholder="Search by food name…"
            className="input pl-9"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="sm:w-48"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug} className="capitalize">
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : foods.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No food items match your search"
              message="Try a different search term, category, or add a new food."
              action={
                <button
                  onClick={() => navigate("/dashboard/foods/new")}
                  className="btn-primary"
                >
                  <FaPlus size={13} /> Add food
                </button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Item</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Price</th>
                  <th className="px-5 py-3 font-semibold">Stock</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {foods.map((item, index) => {
                  const price = Number(item.price) || 0;
                  const rating = Number(item.rating) || 0;
                  const stock = Number(item.stock) || 0;
                  const hasDiscount =
                    item.discountPrice !== undefined &&
                    Number(item.discountPrice) > 0 &&
                    Number(item.discountPrice) < price;
                  const effectivePrice = hasDiscount ? Number(item.discountPrice) : price;
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 text-gray-400">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={foodImage(item)}
                            alt={item.name}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <span className="block max-w-[220px] truncate font-semibold text-gray-800">
                              {item.name}
                            </span>
                            {hasDiscount && (
                              <span className="text-[11px] font-medium text-gray-400 line-through">
                                ${price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="badge bg-gray-100 text-gray-600 capitalize">
                          <CategoryLabel slug={item.category} />
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-800">
                        ${effectivePrice.toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`badge ${
                            stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {stock} left
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{rating.toFixed(1)} ★</td>
                      <td className="px-5 py-3">
                        <span
                          className={`badge ${
                            item.availability && stock > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.availability && stock > 0 ? "Available" : "Sold out"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => navigate(`/dashboard/foods/edit/${item._id}`)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                            aria-label={`Edit ${item.name}`}
                          >
                            <FaEdit size={15} />
                          </button>
                          <button
                            onClick={() => void handleDelete(item._id, item.name)}
                            disabled={isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-60"
                            aria-label={`Delete ${item.name}`}
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
    </div>
  );
};

export default FoodsPage;
