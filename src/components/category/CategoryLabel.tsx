import { useCategories } from "../../hooks/useCategories";
import { categorySlugToLabel } from "../../utils/categories";

const CategoryLabel: React.FC<{ slug: string }> = ({ slug }) => {
  const { categories } = useCategories();
  const category = categories.find((item) => item.slug === slug);
  return <>{category?.name ?? categorySlugToLabel(slug)}</>;
};

export default CategoryLabel;
