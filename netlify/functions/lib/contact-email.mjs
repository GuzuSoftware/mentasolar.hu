export const CONTACT_FORM_NAME = 'kapcsolat';
export const NOTIFICATION_RECIPIENT = 'info@mentasolar.hu';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function isContactSubmission(data) {
  return data?.['form-name'] === CONTACT_FORM_NAME;
}

export function isValidReplyTo(value) {
  return typeof value === 'string' && emailPattern.test(value.trim());
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function field(data, name) {
  const value = data[name];
  return typeof value === 'string' && value.trim() ? value.trim() : 'Nincs megadva';
}

export function createEmailPayload(data, from) {
  const replyTo = typeof data.email === 'string' && isValidReplyTo(data.email)
    ? data.email.trim()
    : undefined;

  const rows = [
    ['Név', field(data, 'nev')],
    ['E-mail-cím', field(data, 'email')],
    ['Telefonszám', field(data, 'telefon')],
    ['Érdeklődés tárgya', field(data, 'erdeklodes')],
    ['Ajánlatazonosító', field(data, 'ajanlat-azonosito')],
    ['Üzenet', field(data, 'uzenet')],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><th align="left" style="padding:8px;border:1px solid #d9e1dc;background:#f3f7f4">${escapeHtml(label)}</th><td style="padding:8px;border:1px solid #d9e1dc;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join('');
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n\n');

  return {
    from,
    to: [NOTIFICATION_RECIPIENT],
    subject: 'MentaSolar – új érdeklődés',
    html: `<h1 style="font-size:20px">Új MentaSolar érdeklődés</h1><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${htmlRows}</table>`,
    text: `Új MentaSolar érdeklődés\n\n${text}`,
    ...(replyTo ? { reply_to: replyTo } : {}),
  };
}

export async function sendResendNotification({ data, apiKey, from, request = fetch }) {
  if (!apiKey || !from) return { status: 'configuration-error' };

  try {
    const response = await request('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createEmailPayload(data, from)),
    });

    if (!response.ok) return { status: 'api-error', httpStatus: response.status };
    return { status: 'sent' };
  } catch (error) {
    return {
      status: 'request-error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
