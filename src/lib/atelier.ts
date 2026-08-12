// Comanda din Atelier — conversațională, prin WhatsApp. Fără coș, fără
// checkout: deschidem chat-ul Alexandrei cu un mesaj deja scris, iar ea
// confirmă personal disponibilitatea și restul. Numărul e public (apare
// oricum în link-ul wa.me din pagină) — nu e un secret.
export const WHATSAPP_NUMBER = '40754015566';

/** Link wa.me cu mesaj pre-scris pentru un anume produs din atelier. */
export function orderUrl(name: string, price?: string | null): string {
  const pricePart = price ? ` (${price})` : '';
  const text = `Bună, Alexandra! Mă interesează „${name}"${pricePart} din atelier. Mai e disponibil?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
