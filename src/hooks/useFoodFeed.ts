import { useEffect, useMemo, useRef, useState } from "react";
import { useGetFoodsQuery } from "../redux/api/foodApi";
import type { IFood, IGetFoodsArgs } from "../types/food";

export interface FoodFeedOptions {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availability?: boolean;
  sortBy?: "price" | "rating" | "newest" | "oldest";
  sortOrder?: "asc" | "desc";
  popular?: boolean;
  pageSize?: number;
}

export interface FoodFeedState {
  foods: IFood[];
  total: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  hasError: boolean;
  loadMore: () => void;
  retry: () => void;
  sentinelRef: React.RefObject<HTMLDivElement>;
}

export const useFoodFeed = (options: FoodFeedOptions): FoodFeedState => {
  const {
    searchTerm,
    category,
    minPrice,
    maxPrice,
    minRating,
    availability,
    sortBy,
    sortOrder,
    popular,
    pageSize = 12,
  } = options;

  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<IFood[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filterKey = JSON.stringify([
    searchTerm ?? "",
    category ?? "",
    minPrice ?? "",
    maxPrice ?? "",
    minRating ?? "",
    availability ?? "",
    sortBy ?? "newest",
    sortOrder ?? "desc",
    popular ?? false,
  ]);

  const args = useMemo<IGetFoodsArgs>(
    () => ({
      page,
      limit: pageSize,
      searchTerm: searchTerm || undefined,
      category: category || undefined,
      minPrice: minPrice,
      maxPrice: maxPrice,
      minRating: minRating,
      availability: availability,
      sortBy,
      sortOrder,
      popular: popular || undefined,
    }),
    [
      page,
      pageSize,
      searchTerm,
      category,
      minPrice,
      maxPrice,
      minRating,
      availability,
      sortBy,
      sortOrder,
      popular,
    ]
  );

  const { data, isFetching, isError } = useGetFoodsQuery(args, {
    skip: !hasMore,
  });

  useEffect(() => {
    setPage(1);
    setFoods([]);
    setHasMore(true);
    setTotal(0);
  }, [filterKey]);

  useEffect(() => {
    if (!data) return;
    setFoods((prev) => {
      const next = [...prev, ...data.foods];
      return next.filter(
        (food, index, all) => all.findIndex((f) => f._id === food._id) === index
      );
    });
    setHasMore(data.meta.page < data.meta.totalPages);
    setTotal(data.meta.total);
  }, [data]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetching, filterKey]);

  const loadMore = (): void => {
    if (hasMore && !isFetching) setPage((p) => p + 1);
  };

  const retry = (): void => {
    setPage(1);
    setFoods([]);
    setHasMore(true);
    setTotal(0);
  };

  return {
    foods,
    total,
    isLoading: isFetching && foods.length === 0,
    isFetchingMore: isFetching && foods.length > 0,
    hasMore,
    hasError: isError,
    loadMore,
    retry,
    sentinelRef,
  };
};
