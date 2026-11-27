import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { config } from '../config/env';
import { createLogger } from '../utils/logger';

const logger = createLogger('AuthService');
const userRepository = AppDataSource.getRepository(User);
const jwtSecret = process.env.JWT_SECRET || 'change-this-secret-in-production';
const jwtExpiresIn = (process.env.JWT_EXPIRES_IN || '1h') as jwt.SignOptions['expiresIn'];

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    user: {
        id: number;
        email: string;
        name: string;
        isVerified: boolean;
    };
}

interface LoginInput {
    email: string;
    password: string;
}

interface TokenPayload {
    userId: number;
    email: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

export class AuthService {
    /**
     * Register a new user
     */
    static async register(input: RegisterInput): Promise<RegisterResponse> {
        const name = input.name.trim();
        const email = input.email.trim().toLowerCase();
        const { password } = input;

        // 1. Check if email already exists
        const existingUser = await userRepository.findOne({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            logger.warn('Registration attempt with existing email', { email });
            throw new ConflictError('Email is already registered');
        }

        // 2. Hash password
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Create and save user
        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            isActive: true,
            isVerified: false,
        });

        const savedUser = await userRepository.save(newUser);

        logger.info('User registered successfully', {
            userId: savedUser.id,
            email: savedUser.email,
        });

        // 4. Return safe user info (never expose password hash)
        return {
            user: {
                id: savedUser.id,
                email: savedUser.email,
                name: savedUser.name,
                isVerified: savedUser.isVerified,
            },
        };
    }

    /**
     * Login user and generate JWT token
     */
    static async login(input: LoginInput): Promise<AuthResponse> {
        const { email, password } = input;

        // 1. Find user by email
        const user = await userRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                isActive: true,
                isVerified: true,
            },
        });

        if (!user) {
            logger.warn('Login attempt with non-existent email', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        // 2. Check if email is verified
        if (!user.isVerified) {
            logger.warn('Login attempt for unverified account', { email });
            throw new UnauthorizedError(
                'Please verify your email address before logging in. Check your inbox for the verification link.'
            );
        }

        // 3. Check if user is active
        if (!user.isActive) {
            logger.warn('Login attempt for inactive account', { email });
            throw new UnauthorizedError('Account is deactivated');
        }

        // 4. Compare passwords
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            logger.warn('Login attempt with wrong password', { email });
            throw new UnauthorizedError('Invalid email or password');
        }

        // 5. Generate JWT token
        const tokenPayload: TokenPayload = {
            userId: user.id,
            email: user.email,
        };

        const token = jwt.sign(tokenPayload, jwtSecret, {
            expiresIn: jwtExpiresIn,
        });

        logger.info('User logged in successfully', {
            userId: user.id,
            email,
        });

        // 6. Return token and user data
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Verify JWT token
     */
    static async verifyToken(token: string): Promise<TokenPayload> {
        try {
            const decoded = jwt.verify(
                token,
                jwtSecret
            ) as TokenPayload;

            return decoded;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token has expired');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid token');
            }

            throw new UnauthorizedError('Authentication failed');
        }
    }

    /**
     * Get user from token
     */
    static async getUserFromToken(token: string): Promise<User> {
        const decoded = await this.verifyToken(token);

        const user = await userRepository.findOne({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new UnauthorizedError('User not found');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated');
        }

        return user;
    }
}