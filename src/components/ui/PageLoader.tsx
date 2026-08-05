const PageLoader: React.FC = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
      <p className="text-sm font-semibold text-gray-500">Loading…</p>
    </div>
  </div>
);

export default PageLoader;
