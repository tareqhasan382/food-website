interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) => {
  const alignment =
    align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`mb-10 flex flex-col gap-2 ${alignment}`}>
      {eyebrow && (
        <span className="badge bg-brand-50 text-brand">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="max-w-2xl text-gray-500">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
