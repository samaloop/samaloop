import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalButton({ amount }: { amount: string }) {
  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          // Call your Next.js route handler to initiate the order securely
          const res = await fetch("/api/paypal/create-order", { method: "POST", body: JSON.stringify({ amount }) });
          const order = await res.json();
          return order.id;
        }}
        onApprove={async (data, actions) => {
          // Capture the payment on the server side
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            body: JSON.stringify({ orderId: data.orderID }),
          });
          if (res.ok) {
            alert("Payment successful!");
          }
        }}
      />
    </PayPalScriptProvider>
  );
}