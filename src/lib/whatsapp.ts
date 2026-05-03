export const WHATSAPP_NUMBER = "233500847851";
export const PHONE_DISPLAY = "0500847851";

export function whatsappLink(productName?: string) {
  if (productName) {
    const text = `Hi I'm interested in ${productName}. Is it still available?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Electronic Hive!")}`;
}

export function formatGHS(price: number) {
  return `GHS ${Number(price).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}