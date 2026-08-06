import { useGetCategoriesQuery } from "../redux/api/categoryApi";
import { flattenCategories, type ICategoryOption } from "../utils/categories";

export interface UseCategoriesResult {
  categories: ICategoryOption[];
  isLoading: boolean;
  isError: boolean;
}

export const useCategories = (): UseCategoriesResult => {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = flattenCategories(data ?? []).filter(
    (category) => category.isActive
  );
  return { categories, isLoading, isError };
};
