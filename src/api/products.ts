import instance from "@/api";
import { Product, ProductDetail, ProductsResponse, QueryParams } from "./types/product";

export const getProducts = async (queryParams: QueryParams) => {
  const params = new URLSearchParams(
    Object.entries(queryParams)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  const url = `/product?${params.toString()}`;
  const res = await instance.get<ProductsResponse>(url);
  return res.data;
};

export const getProduct = async (id: string) => {
  const res = await instance.get<ProductDetail>(`/product/${id}`);
  return res.data;
};
