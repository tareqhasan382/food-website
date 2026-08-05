const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <span
    className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white ${className ?? ""}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
