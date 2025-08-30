"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const rateLimit_1 = require("./middleware/rateLimit");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const secret_1 = __importDefault(require("./routes/secret"));
const admin_1 = __importDefault(require("./routes/admin"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)(config_1.config.isDev ? 'dev' : 'combined'));
// Basic middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(rateLimit_1.rateLimit);
app.use((0, cors_1.default)(config_1.config.cors));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/secret', secret_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/wishlist', wishlist_1.default);
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: config_1.config.isDev ? err.message : 'Something went wrong!'
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Not Found'
    });
});
exports.default = app;
