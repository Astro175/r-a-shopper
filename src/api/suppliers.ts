import instance from "@/api";
import { Supplier } from "./types/supplier";

export const getSuppliers = async () => {
  const res = await instance.get<Supplier[]>("/suppliers");
  return res.data;
};
