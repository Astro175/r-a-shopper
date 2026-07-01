import { getProducts } from "@/api/products";
import { QueryParams } from "@/api/types/product";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useProducts = (params: Omit<QueryParams, "cursor">) => {
  return useInfiniteQuery({
    queryKey: ["products", params],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      return getProducts({ ...params, cursor: pageParam ?? undefined });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
