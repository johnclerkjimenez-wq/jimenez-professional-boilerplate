
import 'reflect-metadata';
import express from 'express';
import { config } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './utils/logger';

import {
    helmetMiddleware,
    corsMiddleware,
    apiLimiter
} from './middleware/security';

import { requestLoggingMiddleware } from './middleware/requestLogger';
import {
    errorHandler,
    notFoundHandler
} from './middleware/errorHandler';


import { userRoutes } from './routes/userRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { authRoutes } from './routes/authRoutes';
import { verificationRoutes } from './routes/verificationRoutes';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);
app.use(requestLoggingMiddleware);

app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);



// TEMPORARY DIRECT TEST
app.get('/api/auth/test-direct', (req, res) => {
    res.json({
        success: true,
        message: 'Express direct route working!'
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await AppDataSource.initialize();

        logger.info('✅ Database connected successfully', {
            service: 'api'
        });

        app.listen(port, () => {            logger.info(`🚀 Server running on port ${port}`, {
                service: 'api'

            });

            logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`, {
                service: 'api'
            });

            logger.info(`Healthcheck: http://localhost:${port}/health`, {
                service: 'api'
            });
        });

    } catch (error) {
        logger.error('❌ Failed to start server:', {
            service: 'api',
            error
        });

        process.exit(1);
    }
};

startServer();
