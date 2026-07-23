import instance from "@/api";
import { Supplier } from "./types/supplier";

export const getSuppliers = async () => {
  const res = await instance.get<Supplier[]>("/api/suppliers");
  return res.data.data;
};
