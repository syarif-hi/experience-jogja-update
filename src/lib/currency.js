// TODO: replace this hardcoded approximate rate with a cached/live IDR->USD rate
// via a backend function (functions/get-exchange-rate.ts) in a future session.
export const APPROX_IDR_USD_RATE = 0.000061; // ~ Rp 16,400 per USD

// Rounds to a sensible display value (no false decimal precision) and prefixes Rp / $.
export function formatPrice(price_idr, currency = "IDR", rate = APPROX_IDR_USD_RATE) {
  const amount = Number(price_idr) || 0;
  if (currency === "USD") {
    const usd = amount * rate;
    const rounded = usd < 10 ? Math.round(usd) : Math.round(usd);
    return `≈ $${rounded}`;
  }
  return `Rp ${amount.toLocaleString("id-ID")}`;
}