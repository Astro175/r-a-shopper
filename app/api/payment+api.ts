import { PaymentVerificationResponse } from "@/api/types/payment";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { CartItem } from "@/stores/cartStore";
import axios from "axios";
import { StatusError } from "expo-server";

type ResponseData = {
  reference: string;
  location: string;
  cartItems: CartItem[];
};

type InitializePaymentResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};


type CheckoutResponse = {
  amount: number;
  checkout_reference: string;
  payment_status: string;
  is_new: boolean;
};

const getOrderDetails = async (reference: string) => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
            *,
            seller: suppliers(*),
            order_items(*)
            `,
    )
    .eq("checkout_reference", reference)
    .single();
  if (error || !data) {
    return { success: false, error };
  }
  return { success: true, data };
};

export async function POST(request: Request) {
  const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;
  if (!token) {
    throw new StatusError(401, "Unauthenticated user");
  }
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.getClaims(token);

  if (!authData || authError) {
    throw new StatusError(401, "Unauthenticated user");
  }
  const { cartItems, reference, location } =
    (await request.json()) as ResponseData;
  if (!cartItems || !reference || !location) {
    throw new StatusError(400, "Bad Request");
  }
  const userId = authData.claims.sub;
  const email = authData.claims.email;

  try {
    const { data: checkoutData, error } = await supabaseAdmin.rpc("checkout", {
      p_reference: reference,
      user_location: location,
      p_user_id: userId,
      cart_items: cartItems.map(({ id, quantity }) => ({ id, quantity })),
    });
    if (error && error.code === "A0001") {
      throw new StatusError(400, "You can only order one seller at a time");
    } else if (error) {
      throw new StatusError(500, "Checkout failed");
    }
    const result = checkoutData as CheckoutResponse;

    if (!result.is_new) {
      if (result.payment_status === "PROCESSING") {
        const { data: paystackResponse, status } =
          await axios.get<PaymentVerificationResponse>(
            `https://api.paystack.co/transaction/verify/${result.checkout_reference}`,
            { headers: { Authorization: `Bearer ${SECRET_KEY}` } },
          );

        if (status > 300 || paystackResponse.data.status !== "success") {
          return Response.json("Processing, check back shortly");
        }
        // TODO: webhook not yet wired — payments.status won't reflect this until Day 6/7
        const { data, error } = await getOrderDetails(
          result.checkout_reference,
        );
        if (error) {
          throw new StatusError(500, `Failed to fetch order: ${error.message}`);
        }
        return Response.json({
          order_reference: data.checkout_reference,
          orderItems: data.order_items,
          status: "successful",
          numberOfItems: data.number_of_items,
          totalAmount: data.total,
          location: data.location,
        });
      } else if (result.payment_status === "FAILED") {
        return Response.json({ status: "failed" });
      } else if (result.payment_status === "SUCCESS") {
        const { data, error } = await getOrderDetails(
          result.checkout_reference,
        );
        if (error) {
          throw new StatusError(500, `Failed to fetch order: ${error.message}`);
        }
        return Response.json({
          order_reference: data.checkout_reference,
          orderItems: data.order_items,
          status: "successful",
          numberOfItems: data.number_of_items,
          totalAmount: data.total,
          location: data.location,
        });
      } else {
        throw new StatusError(500, "Unexpected payment state");
      }
    }

    const { data, status } = await axios.post<InitializePaymentResponse>(
      "https://api.paystack.co/transaction/initialize",
      { email, amount: result.amount },
      { headers: { Authorization: `Bearer ${SECRET_KEY}` } },
    );

    if (!data || status > 300) {
      throw new StatusError(500, "Unable to process payment request");
    }
    return Response.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    if (err instanceof Error) {
      throw new StatusError(500, err.message);
    } else {
        throw new StatusError(500, "Unexpected Error")
    }
  }
}
