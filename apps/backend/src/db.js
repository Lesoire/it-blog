import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Railway та більшість production-провайдерів дають готовий DATABASE_URL.
// Локально можна або задати DATABASE_URL, або окремі PG-змінні.
const connectionString = process.env.DATABASE_URL;

// SSL потрібен на більшості хмарних провайдерів, але не локально.
const needSSL =
  process.env.PGSSL === 'true' ||
  (connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1'));

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: needSSL ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '1234',
        database: process.env.PGDATABASE || 'itblog',
      }
);

// Зручний хелпер для запитів
export const query = (text, params) => pool.query(text, params);
