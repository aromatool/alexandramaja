import { WHATSAPP_NUMBER } from './atelier';

// Sursele acceptate de /api/request — fiecare devine un tab în Google Sheet.
// Ca să adaugi o secțiune nouă (ex: „vorbe-de-leac”), pui cheia aici.
export const REQUEST_SOURCES = ['carte', 'lucreaza-cu-alexandra', 'vorbe-de-leac', 'atelier'] as const;
export type RequestSource = (typeof REQUEST_SOURCES)[number];

export function isRequestSource(value: string): value is RequestSource {
  return (REQUEST_SOURCES as readonly string[]).includes(value);
}

/** Înlocuiește {{cheie}} din șablon cu valorile din `fields`. */
export function fillTemplate(template: string, fields: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => fields[key] ?? '');
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
