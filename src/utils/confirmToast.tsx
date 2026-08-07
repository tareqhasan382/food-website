import toast from "react-hot-toast";

interface ConfirmToastOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const confirmToast = (
  options: ConfirmToastOptions,
  onConfirm: () => void | Promise<void>
): void => {
  const { title, description, confirmLabel = "Delete", cancelLabel = "Cancel" } =
    options;

  toast(
    (t) => (
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              void onConfirm();
            }}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        padding: "0",
        borderRadius: "16px",
        background: "#ffffff",
        color: "#111827",
        maxWidth: "340px",
        width: "340px",
        boxShadow:
          "0 20px 50px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(0 0 0 / 0.05)",
      },
    }
  );
};
