import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  const headers = req.headers;
  const rawBody = await req.json();

  try {
    const accessToken = await getPayPalAccessToken();

    // Verify signature via PayPal API
    const verifyRes = await fetch(`${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: rawBody,
      }),
    });

    const { verification_status } = await verifyRes.json();

    if (verification_status !== "SUCCESS") {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    // Handle specific event types
    switch (rawBody.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        const captureData = rawBody.resource;
        const orderId = captureData.supplementary_data?.related_ids?.order_id;
        
        // TODO: Update database status to "PAID" using orderId or captureData.id
        console.log(`Payment successfully captured for Order: ${orderId}`);
        break;

      case "PAYMENT.CAPTURE.DENIED":
        // TODO: Handle failed payments
        break;

      default:
        console.log(`Unhandled webhook event: ${rawBody.event_type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
