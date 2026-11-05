import type { FormSubmittedEvent } from '@netlify/functions';
import { isContactSubmission, sendResendNotification } from './lib/contact-email.mjs';

export default {
  async formSubmitted(event: FormSubmittedEvent) {
    if (!isContactSubmission(event.data)) return;

    const result = await sendResendNotification({
      data: event.data,
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
    });

    if (result.status !== 'sent') {
      console.error('[kapcsolat-form-email] Notification was not sent.', result);
    }
  },
};
