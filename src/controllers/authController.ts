
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UnauthorizedError } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuthController');

export class AuthController {

    /**
     * POST /api/auth/login
     */
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const authResponse = await AuthService.login({
            email,
            password
        });

        logger.info('Login successful', {
            userId: authResponse.user.id
        });

        sendSuccess(res, authResponse, 'Login successful');
    }

    /**
     * GET /api/auth/me
     */
    static async getMe(req: Request, res: Response) {

        if (!req.user) {
            throw new UnauthorizedError('Unauthorized');
        }

        const user = await AuthService.getUserFromToken(
            req.headers.authorization!.split(' ')[1]
        );

        sendSuccess(res, user);
    }
}
