import { getProduct } from "@/api/products"
import { useQuery } from "@tanstack/react-query"

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(id),
        enabled: !!id
    })
}