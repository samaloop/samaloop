export async function getPayPalAccessToken() {
  const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`).toString("base64");
  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const data = await res.json();
  return data.access_token;
}