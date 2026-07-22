import type { APIRoute } from 'astro';

// Rută on-demand (rulează în Cloudflare Worker, nu e prerenderată).
// Primește un email de la formularele de newsletter și îl trimite la MailerLite.
// Cheia API stă DOAR în variabilele de mediu din Cloudflare — niciodată în cod,
// niciodată pe GitHub (același model ca secretele Keystatic).
export const prerender = false;

interface Env {
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
}

// Citește o variabilă de mediu atât în Cloudflare (locals.runtime.env), cât și
// local / prin nodejs_compat (process.env).
function readEnv(locals: App.Locals, name: keyof Env): string | undefined {
  const runtimeEnv = (locals as { runtime?: { env?: Env } })?.runtime?.env;
  return runtimeEnv?.[name] ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, locals }) => {
  const apiKey = readEnv(locals, 'MAILERLITE_API_KEY');
  const groupId = readEnv(locals, 'MAILERLITE_GROUP_ID');

  // Extrage emailul din JSON sau din form-data.
  let email = '';
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { email?: string };
      email = (body.email ?? '').trim();
    } else {
      const form = await request.formData();
      email = String(form.get('email') ?? '').trim();
    }
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 422);
  }

  // Dacă lipsește cheia (ex. local, sau nu e configurată încă), nu picăm urât —
  // răspundem că nu e configurat, iar UI-ul poate trata elegant.
  if (!apiKey) {
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  try {
    const payload: { email: string; groups?: string[] } = { email };
    if (groupId) payload.groups = [groupId];

    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // MailerLite întoarce 200 (existent) sau 201 (nou) la succes.
    if (res.ok) {
      return json({ ok: true });
    }

    // 422 = email deja pe listă în anumite cazuri; îl tratăm tot ca succes blând.
    if (res.status === 422) {
      return json({ ok: true, note: 'already_subscribed' });
    }

    return json({ ok: false, error: 'provider_error' }, 502);
  } catch {
    return json({ ok: false, error: 'network_error' }, 502);
  }
};
