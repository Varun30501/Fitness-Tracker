import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    email: {
        config: {
            provider: "sendgrid",
            providerOptions: {
                apiKey: env("SENDGRID_API_KEY"),
            },
            settings: {
                defaultFrom: "fittrack28@gmail.com",
                defaultReplyTo: "fittrack28@gmail.com",
            },
        },
    },
});

export default config;

