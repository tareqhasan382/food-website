import type { ICategoryResponse } from "../redux/api/categoryApi";

export interface ICategoryOption {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
}

export const flattenCategories = (
  categories: ICategoryResponse[]
): ICategoryOption[] => {
  const result: ICategoryOption[] = [];
  const walk = (nodes: ICategoryResponse[]): void => {
    for (const node of nodes) {
      result.push({
        _id: node._id,
        name: node.name,
        slug: node.slug,
        image: node.image,
        description: node.description,
        isActive: node.isActive,
      });
      if (node.children && node.children.length > 0) walk(node.children);
    }
  };
  walk(categories);
  return result;
};

export const categorySlugToLabel = (slug: string): string => {
  if (!slug) return slug;
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};
