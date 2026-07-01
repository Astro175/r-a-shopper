import { getSuppliers } from "@/api/suppliers";
import { useQuery } from "@tanstack/react-query";

export const useSupplier = () => {
  return useQuery({
    queryKey: ["supplier"],
    queryFn: () => getSuppliers(),
  });
};
