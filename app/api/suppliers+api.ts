import { supabaseAdmin } from "@/lib/supabaseServer";
import { StatusError } from "expo-server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;
  if (!token) throw new StatusError(401, "Unauthenticated");
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.getClaims(token);
  if (!authData || authError) throw new StatusError(401, "Unauthenticated");
  const { data, error } = await supabaseAdmin.from("suppliers").select("*");
  if (!data) throw new StatusError(404, "No suppliers found");
  if (error) throw new StatusError(500, "Server error");
  return Response.json({ data });
}
