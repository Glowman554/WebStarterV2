import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import solid from 'eslint-plugin-solid/configs/typescript';
import * as tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    {
        ignores: ['dist', 'drizzle.config.ts', 'vite.config.ts'],
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            globals: { ...globals.node, ...globals.browser, NodeJS: 'readonly' },
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': ts,
            solid: solid.plugins.solid,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...ts.configs.recommended.rules,
            ...solid.rules,
        },
    },
];
