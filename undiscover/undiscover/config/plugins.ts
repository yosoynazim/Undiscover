import type { Core } from '@strapi/strapi';

const config = (_: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        // jsonTransport: no envía nada, solo loguea. Reemplazar por SMTP real cuando haya dominio.
        jsonTransport: true,
      },
      settings: {
        defaultFrom: 'noreply@undiscover.com.ar',
        defaultReplyTo: 'noreply@undiscover.com.ar',
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
