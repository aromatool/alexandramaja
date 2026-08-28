import type { APIRoute } from 'astro';
import { isRequestSource } from '../../lib/requestForm';

// Rută on-demand — primește cererile din formularele reutilizabile
// (RequestForm.astro) și le scrie într-un Google Sheet, printr-un mic
// Google Apps Script legat de sheet-ul Alexandrei (webhook-ul e un secret
// Cloudflare, niciodată în cod — același model ca MAILERLITE_API_KEY).
export const prerender = false;

interface Env {
  SHEETS_WEBHOOK_URL?: string;
}

function readEnv(locals: App.Locals, name: keyof Env): string | undefined {
  const runtimeEnv = (locals as { runtime?: { env?: Env } })?.runtime?.env;
  return runtimeEnv?.[name] ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const webhookUrl = readEnv(locals, 'SHEETS_WEBHOOK_URL');

  let source = '';
  let fields: Record<string, string> = {};
  try {
    const body = (await request.json()) as { source?: string; fields?: Record<string, string> };
    source = String(body.source ?? '');
    fields = body.fields ?? {};
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  if (!isRequestSource(source)) {
    return json({ ok: false, error: 'invalid_source' }, 422);
  }

  // Curățăm — doar string-uri, ca nimeni să nu poată trimite obiecte imbricate
  // către sheet.
  const cleanFields: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.trim()) cleanFields[key] = value.trim().slice(0, 2000);
  }

  if (!webhookUrl) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, fields: cleanFields, receivedAt: new Date().toISOString() }),
    });
    if (!res.ok) return json({ ok: false, error: 'provider_error' }, 502);
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'network_error' }, 502);
  }
};
