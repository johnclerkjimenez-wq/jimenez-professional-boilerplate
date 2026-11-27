
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

// Environment schema
const envSchema = Joi.object({
    // Keep your existing environment variables here

    // Email configuration
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    EMAIL_FROM: Joi.string().email().required(),
}).unknown();

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env);

if (error) {
    throw new Error(`Environment validation error: ${error.message}`);
}

// Application configuration
export const config = {
    // Keep your existing config here

    database: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
    },

    email: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
        from: env.EMAIL_FROM,
    },
};
