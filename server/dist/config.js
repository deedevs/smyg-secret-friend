"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const MONGODB_URI = 'mongodb+srv://dladipo21:pWhs70U0bqHWlNcj@washme-app.lcwiu.mongodb.net/smyg-secret-friend?retryWrites=true&w=majority&appName=washme-app';
const isProd = true;
exports.config = {
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
};
