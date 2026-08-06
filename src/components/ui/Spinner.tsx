type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-12 w-12 border-4",
};

const Spinner: React.FC<{ className?: string; size?: SpinnerSize }> = ({
  className,
  size = "md",
}) => (
  <span
    className={`inline-block animate-spin rounded-full border-white/40 border-t-white ${
      sizeClasses[size]
    } ${className ?? ""}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
