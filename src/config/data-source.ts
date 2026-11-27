import { DataSource } from 'typeorm';
import { config } from './env';


export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.database.host,
    
    port: config.database.port,
    username: config.database.username,     
    password: config.database.password,
    database: config.database.database,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: false,
    logging: true,
});

