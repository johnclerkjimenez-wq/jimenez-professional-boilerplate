
import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { createLogger } from '../utils/logger';
import { InternalError } from '../utils/errors';

const logger = createLogger('EmailService');

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

// Verify email connection
transporter.verify()
    .then(() => logger.info('Email service connected'))
    .catch((error) =>
        logger.error('Email service connection failed', { error })
    );

export class EmailService {

    /**
     * Send verification email
     */
    static async sendVerificationEmail(email: string, token: string) {

        const verificationLink =
            `${apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Verify Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h2>Welcome to Our App!</h2>

                <p>Thank you for registering.</p>

                <p>Please verify your email address by clicking below:</p>

                <a href="${verificationLink}"
                   style="
                       display: inline-block;
                       padding: 12px 24px;
                       background-color: #007bff;
                       color: white;
                       text-decoration: none;
                       border-radius: 5px;
                   ">
                    Verify Email Address
                </a>

                <p>Or copy this link:</p>

                <p style="word-break: break-all;">
                    ${verificationLink}
                </p>

                <p><strong>This link expires in 24 hours.</strong></p>

                <p>If you did not create an account, ignore this email.</p>

            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Verify Your Email Address',
            html,
        });
    }

    /**
     * Send password reset email
     */
    static async sendPasswordResetEmail(email: string, token: string) {

        const resetLink =
            `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Password Reset</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">

                <h2>Password Reset Request</h2>

                <p>We received a request to reset your password.</p>

                <a href="${resetLink}"
                   style="
                       display: inline-block;
                       padding: 12px 24px;
                       background-color: #dc3545;
                       color: white;
                       text-decoration: none;
                       border-radius: 5px;
                   ">
                    Reset Password
                </a>

                <p>Or copy this link:</p>

                <p style="word-break: break-all;">
                    ${resetLink}
                </p>

                <p><strong>This link expires in 1 hour.</strong></p>

                <p>If you did not request a password reset, ignore this email.</p>

            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html,
        });
    }

    /**
     * Generic email sender
     */
    private static async sendEmail(options: {
        to: string;
        subject: string;
        html: string;
    }) {

        try {
            const info = await transporter.sendMail({
                from: `"Your App" <${config.email.from}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
            });

            logger.info('Email sent successfully', {
                to: options.to,
                subject: options.subject,
                messageId: info.messageId,
            });

            // Ethereal email preview
            const previewUrl = nodemailer.getTestMessageUrl(info);

            console.log('================================');
            console.log('EMAIL SENT SUCCESSFULLY!');
            console.log('Message ID:', info.messageId);
            console.log('Ethereal Preview URL:', previewUrl);
            console.log('================================');

            logger.info('Ethereal preview URL', { previewUrl });

            

        } catch (error) {

            logger.error('Failed to send email', {
                to: options.to,
                subject: options.subject,
                error,
            });

            throw new InternalError('Failed to send email');
        }
    }
}
