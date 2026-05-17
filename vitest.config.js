"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
var path_1 = require("path");
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/**/*.test.ts'],
        exclude: ['node_modules', '.next'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/services/**/*.ts', 'src/middleware/**/*.ts'],
            exclude: ['src/services/websocket/**'],
        },
        testTimeout: 30000,
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
            '@tests': path_1.default.resolve(__dirname, './tests'),
        },
    },
});
