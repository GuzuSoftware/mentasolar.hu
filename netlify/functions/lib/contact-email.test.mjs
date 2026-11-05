import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createEmailPayload,
  isContactSubmission,
  isValidReplyTo,
  sendResendNotification,
} from './contact-email.mjs';

const completeSubmission = {
  'form-name': 'kapcsolat',
  nev: 'Teszt Elek',
  email: 'teszt@example.com',
  telefon: '+36 70 000 0000',
  erdeklodes: 'Új napelemes rendszer',
  'ajanlat-azonosito': 'teszt-csomag',
  uzenet: 'Teszt üzenet',
};

test('csak a kapcsolat űrlap indít értesítést', () => {
  assert.equal(isContactSubmission(completeSubmission), true);
  assert.equal(isContactSubmission({ 'form-name': 'masik-urlap' }), false);
  assert.equal(isContactSubmission({}), false);
});

test('a levél tartalmazza a mezőket és escape-eli a HTML-t', () => {
  const payload = createEmailPayload({ ...completeSubmission, uzenet: '<script>hiba</script>' }, 'MentaSolar <no-reply@example.com>');
  assert.equal(payload.reply_to, 'teszt@example.com');
  assert.match(payload.html, /&lt;script&gt;hiba&lt;\/script&gt;/);
  assert.match(payload.text, /Ajánlatazonosító: teszt-csomag/);
});

test('a hiányzó opcionális mező és az érvénytelen Reply-To biztonságosan kezelődik', () => {
  const payload = createEmailPayload({ ...completeSubmission, email: 'hibas-email', telefon: '', 'ajanlat-azonosito': '' }, 'MentaSolar <no-reply@example.com>');
  assert.equal('reply_to' in payload, false);
  assert.match(payload.text, /Telefonszám: Nincs megadva/);
  assert.equal(isValidReplyTo('hibas-email'), false);
});

test('hiányzó API-kulcsnál nem indul külső kérés', async () => {
  let called = false;
  const result = await sendResendNotification({
    data: completeSubmission,
    apiKey: '',
    from: 'MentaSolar <no-reply@example.com>',
    request: async () => { called = true; },
  });
  assert.equal(result.status, 'configuration-error');
  assert.equal(called, false);
});

test('a Resend API- és hálózati hibája kontrollált eredményt ad', async () => {
  const apiError = await sendResendNotification({
    data: completeSubmission,
    apiKey: 'teszt-kulcs',
    from: 'MentaSolar <no-reply@example.com>',
    request: async () => ({ ok: false, status: 503 }),
  });
  assert.deepEqual(apiError, { status: 'api-error', httpStatus: 503 });

  const requestError = await sendResendNotification({
    data: completeSubmission,
    apiKey: 'teszt-kulcs',
    from: 'MentaSolar <no-reply@example.com>',
    request: async () => { throw new Error('Kapcsolati hiba'); },
  });
  assert.deepEqual(requestError, { status: 'request-error', message: 'Kapcsolati hiba' });
});
