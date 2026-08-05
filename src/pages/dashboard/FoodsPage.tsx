import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { deleteFood, resetFoods } from "../../redux/foodSlice";
import EmptyState from "../../components/ui/EmptyState";

const PAGE_SIZE = 8;

const FoodsPage: React.FC = () => {
  const foods = useAppSelector((state) => state.food);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category))),
    [foods]
  );

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const filtered = useMemo(() => {
    let list = [...foods];
    if (category) list = list.filter((f) => f.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  }, [foods, search, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string, name: string): void => {
    const confirmed = window.confirm(`Delete "${name}" from the menu?`);
    if (!confirmed) return;
    try {
      dispatch(deleteFood(id));
      toast.success(`${name} deleted successfully`);
    } catch {
      toast.error("Failed to delete food item");
    }
  };

  const handleReset = (): void => {
    dispatch(resetFoods());
    toast.success("Menu restored to default data");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            All Foods
          </h2>
          <p className="text-sm text-gray-500">
            {foods.length} items in your menu.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="btn-ghost">
            Reset data
          </button>
          <button
            onClick={() => navigate("/dashboard/foods/new")}
            className="btn-primary"
          >
            <FaPlus size={13} /> Add food
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by food name…"
            className="input pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input sm:w-48"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="capitalize">
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {visible.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No food items match your search"
              message="Try a different search term or category."
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
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visible.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-gray-400">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 shrink-0 rounded-lg object-cover"
                        />
                        <span className="max-w-[180px] truncate font-semibold text-gray-800">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="badge bg-gray-100 text-gray-600 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.rating.toFixed(1)} ★
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`badge ${
                          item.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.available ? "Available" : "Sold out"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => navigate(`/dashboard/foods/edit/${item.id}`)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                          aria-label={`Edit ${item.name}`}
                        >
                          <FaEdit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          aria-label={`Delete ${item.name}`}
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

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-brand disabled:opacity-40"
          >
            <FaChevronLeft size={12} /> Prev
          </button>
          <span className="text-sm font-semibold text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
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
