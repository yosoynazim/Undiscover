import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: env('RESEND_API_KEY'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM', 'noreply@undiscover.com.ar'),
        defaultReplyTo: env('EMAIL_FROM', 'noreply@undiscover.com.ar'),
      },
    },
  },
  'users-permissions': {
    config: {
      emailConfirmation: true,
    },
  },
});

export default config;
