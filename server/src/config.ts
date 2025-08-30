import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = 'mongodb+srv://dladipo21:pWhs70U0bqHWlNcj@washme-app.lcwiu.mongodb.net/smyg-secret-friend?retryWrites=true&w=majority&appName=washme-app';

const isProd = true;

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev_super_secret_change_me',
  cookieName: process.env.COOKIE_NAME || 'smyg_auth',
  cookieSecure: isProd ? true : process.env.COOKIE_SECURE === 'true',
  isDev: !isProd,
  cors: {
    origin: isProd ? ['https://smyg.site', 'https://www.smyg.site'] : 'http://localhost:5173',
    credentials: true,
  },
  domain: isProd ? '.smyg.site' : 'localhost',
} as const;