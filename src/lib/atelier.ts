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

// Ancoră spre formularul „Anunță-mă" din pagina Atelier (finalul listării).
export const NOTIFY_ANCHOR = '/atelier#atelier-newsletter';

type AtelierData = {
  availability?: string | null;
  returnLabel?: string | null;
  returnMessage?: string | null;
};

/**
 * Disponibilitatea unui produs, tradusă în ce afișăm. O singură sursă de logică
 * pentru listare și pagina produsului — fără e-commerce („SOLD OUT" etc.), doar
 * limbaj de atelier care lucrează cu anotimpuri și loturi mici.
 */
export function availabilityInfo(d: AtelierData) {
  const status = (d.availability ?? 'available') as 'available' | 'seasonal' | 'preparing';
  const isAvailable = status === 'available';
  const label =
    (d.returnLabel && d.returnLabel.trim()) ||
    (status === 'preparing' ? 'Următorul lot, în pregătire' : 'Revine în sezon');
  const message =
    (d.returnMessage && d.returnMessage.trim()) ||
    (status === 'preparing'
      ? 'Următorul lot este în pregătire. Revine curând în atelier.'
      : 'Lotul acesta s-a încheiat. Revine în sezon, când natura ne dă din nou ingredientele.');
  return { status, isAvailable, label, message };
}
