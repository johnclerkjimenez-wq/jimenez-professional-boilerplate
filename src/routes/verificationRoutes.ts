
import { Router } from 'express';
import { VerificationController } from '../controllers/verificationController';
import { validate } from '../middleware/validate';
import {
    registerSchema,
    emailSchema,
    resetPasswordSchema
} from '../dto/verification.dto';
import { asyncHandler } from '../utils/asyncHandler';

export const verificationRoutes = Router();

console.log('✅ VERIFICATION ROUTES LOADED');

// POST /api/auth/register
verificationRoutes.post(
    '/register',
    validate(registerSchema),
    asyncHandler(VerificationController.register)
);

// GET /api/auth/verify-email
verificationRoutes.get(
    '/verify-email',
    asyncHandler(VerificationController.verifyEmail)
);

// POST /api/auth/resend-verification
verificationRoutes.post(
    '/resend-verification',
    validate(emailSchema),
    asyncHandler(VerificationController.resendVerification)
);

// POST /api/auth/forgot-password
verificationRoutes.post(
    '/forgot-password',
    validate(emailSchema),
    asyncHandler(VerificationController.forgotPassword)
);

// POST /api/auth/reset-password
verificationRoutes.post(
    '/reset-password',
    validate(resetPasswordSchema),
    asyncHandler(VerificationController.resetPassword)
);
