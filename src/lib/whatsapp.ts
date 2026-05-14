export const WHATSAPP_NUMBER = "233500847851";
export const PHONE_DISPLAY = "0538239083";

export function whatsappLink(productName?: string, options?: { url?: string; price?: number }) {
  if (productName) {
    const url = options?.url ?? (typeof window !== "undefined" ? window.location.href : "");
    const priceLine = options?.price ? `\nPrice: ${formatGHS(options.price)}` : "";
    const linkLine = url ? `\nLink: ${url}` : "";
    const text = `Hi Electronic Hive 👋\nI'm interested in *${productName}*.${priceLine}${linkLine}\nIs it still available?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Electronic Hive!")}`;
}

export function formatGHS(price: number) {
  return `GHS ${Number(price).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}