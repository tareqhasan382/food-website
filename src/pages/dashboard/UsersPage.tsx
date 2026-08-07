import { useMemo, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  useDeleteUserMutation,
  useGetAdminUsersQuery,
} from "../../redux/api/userApi";
import { useAppSelector } from "../../redux/hooks";
import type { Role } from "../../types/auth";
import type { AdminUser } from "../../types/admin";

const PAGE_SIZE = 10;

const ROLE_STYLES: Record<Role, string> = {
  admin: "bg-brand-50 text-brand",
  superAdmin: "bg-violet-100 text-violet-700",
  user: "bg-gray-100 text-gray-700",
};

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

const UsersPage: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const args = useMemo(
    () => ({
      searchTerm: search.trim() || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [search, page]
  );

  const { data, isFetching, isLoading, refetch } = useGetAdminUsersQuery(args, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.users ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;

  const handleDelete = async (user: AdminUser): Promise<void> => {
    const confirmed = window.confirm(
      `Delete user "${user.name}" (${user.email})? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success(`${user.name} deleted successfully`);
      if (users.length === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      }
    } catch (err) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        "Failed to delete user";
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-gray-900">
            Users
          </h2>
          <p className="text-sm text-gray-500">
            {meta?.total ?? users.length} registered accounts.
          </p>
        </div>
        <button
          onClick={() => void refetch()}
          disabled={isFetching}
          className="btn-ghost"
        >
          Refresh
        </button>
      </div>

      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name…"
          className="input pl-9"
        />
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No users found"
              message="Try a different search term."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Verified</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const isSelf = currentUser?._id === user._id;
                  return (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {user.profileImg ? (
                            <img
                              src={user.profileImg}
                              alt={user.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                              {user.name?.[0]?.toUpperCase() ?? "?"}
                            </span>
                          )}
                          <span className="font-semibold text-gray-800">
                            {user.name}
                            {isSelf && (
                              <span className="ml-2 text-[11px] font-medium text-gray-400">
                                (you)
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${ROLE_STYLES[user.role]}`}>
                          {user.role === "superAdmin"
                            ? "Super Admin"
                            : user.role === "admin"
                              ? "Admin"
                              : "User"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`badge ${
                            user.emailVerified
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {user.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => void handleDelete(user)}
                            disabled={isSelf || isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Delete ${user.name}`}
                            title={isSelf ? "You cannot delete your own account" : undefined}
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

export default UsersPage;
