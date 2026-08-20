import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    const accessToken = await getPayPalAccessToken();

    const res = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to capture order" }, { status: 500 });
  }
}
