import { supabaseAdmin } from "@/lib/supabaseServer";
import { QueryData } from "@supabase/supabase-js";
import { StatusError } from "expo-server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;
  if (!token) throw new StatusError(401, "Unauthenticated user");
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.getClaims(token);
  if (!authData || authError)
    throw new StatusError(401, "Unauthenticated user");
  const url = new URL(request.url);
  const keys = [
    "limit",
    "cursor",
    "sortBy",
    "category",
    "searchKeyword",
    "maxPrice",
    "minPrice",
    "rating",
  ] as const;

  const params = Object.fromEntries(
    keys.map((key) => [key, url.searchParams.get(key)]),
  );

  const limit = params.limit ? Number(params.limit) : 20;
  let query = supabaseAdmin.from("products").select(`
      id,
      name,
      price,
      category,
      rating,
      description,
      imageUrl:image_url,
      quantity,
      createdAt:created_at,
      seller:suppliers ( id, name )
      `);
  query = params.searchKeyword
    ? query.ilike("name", `%${params.searchKeyword}%`)
    : query;
  query = params.category
    ? query.ilike("category", `%${params.category}%`)
    : query;
  query = params.minPrice ? query.gte("price", Number(params.minPrice)) : query;
  query = params.maxPrice ? query.lte("price", Number(params.maxPrice)) : query;
  if (params.sortBy === "New Today") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    query = query.gte("created_at", today.toISOString());
  } else if (params.sortBy === "New This Week") {
    const week = new Date();
    week.setDate(week.getDate() - 7);
    query = query.gte("created_at", week.toISOString());
  } else if (params.sortBy === "Past 30 days") {
    const month = new Date();
    month.setDate(month.getDate() - 30);
    query = query.gte("createdAt", month.toISOString());
  }
  query = params.rating ? query.gte("rating", Number(params.rating)) : query;
  query = params.cursor
    ? query
        .lt("created_at", params.cursor)
        .order("created_at", { ascending: false })
        .limit(Number(limit))
    : query.order("created_at", { ascending: false }).limit(Number(limit));
  type ProductsWithSuppliers = QueryData<typeof query>;
  const { data, error } = await query;

  if (!data || error || data.length === 0) {
    return Response.json({ products: [], nextCursor: null });
  }
  const products: ProductsWithSuppliers = data;
  const nextCursor =
    products.length < limit ? null : products[products.length - 1].createdAt;

  return Response.json({ products, nextCursor });
}
