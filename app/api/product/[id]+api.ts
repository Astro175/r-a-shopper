import { supabaseAdmin } from "@/lib/supabaseServer";
import { QueryData } from "@supabase/supabase-js";
import { StatusError } from "expo-server";

export async function GET(request: Request, { id }: Record<string, string>) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  if (!token) throw new StatusError(401, "Unauthenticated user");
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.getClaims(token);

  if (!authData || authError) {
    throw new StatusError(401, "Unauthenticated user");
  }
  const productWithSupplierQuery = supabaseAdmin
    .from("products")
    .select(
      `
    id,
    createdAt:created_at,
    name,
    price,
    quantity,
    description,
    category,
    rating,
    imageUrl:image_url,
    seller:suppliers (
    id,
    name,
    location,
    logoUrl:logo_url
)
        `,
    )
    .eq("id", id)
    .single();
  type ProductWithSupplierInfo = QueryData<typeof productWithSupplierQuery>;
  const { data: queryData, error } = await productWithSupplierQuery;
  if (!queryData) throw new StatusError(404, "Product not found");
  if (error) throw new StatusError(500, "Server error");
  const data: ProductWithSupplierInfo = queryData;
  return Response.json({ data });
}
