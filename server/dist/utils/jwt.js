"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function generateToken(user) {
    const payload = {
        userId: user._id.toString(),
        role: user.role,
    };
    return jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, {
        expiresIn: '1d',
    });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
