import type { FormSubmittedEvent } from '@netlify/functions';
import { isContactSubmission, sendResendNotification } from './lib/contact-email.mjs';

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    const fieldNames = Object.keys(event.data).sort();
    const isContactForm = isContactSubmission(event.data);

    console.info('[kapcsolat-form-email] Verified Forms event received.', {
      fieldNames,
      hasFormName: Object.hasOwn(event.data, 'form-name'),
      isContactForm,
    });

    if (!isContactForm) {
      console.info('[kapcsolat-form-email] Event ignored because it does not match the kapcsolat form.');
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    console.info('[kapcsolat-form-email] Preparing Resend notification.', {
      hasResendApiKey: Boolean(apiKey),
      hasResendFromEmail: Boolean(from),
    });

    const result = await sendResendNotification({
      data: event.data,
      apiKey,
      from,
    });

    console.info('[kapcsolat-form-email] Resend notification attempt completed.', {
      status: result.status,
      ...(result.status === 'api-error' ? { httpStatus: result.httpStatus } : {}),
    });

    if (result.status !== 'sent') {
      console.error('[kapcsolat-form-email] Notification was not sent.', result);
    }
  },
};
