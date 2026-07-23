import instance from "@/api";
import { ProductDetail, ProductsResponse, QueryParams } from "./types/product";

export const getProducts = async (queryParams: QueryParams) => {
  const params = new URLSearchParams(
    Object.entries(queryParams)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  const url = `/api/product?${params.toString()}`;
  const res = await instance.get<ProductsResponse>(url);
  return res.data;
};

export const getProduct = async (id: string) => {
  const res = await instance.get<ProductDetail>(`/api/product/${id}`);
  return res.data.data;
};
