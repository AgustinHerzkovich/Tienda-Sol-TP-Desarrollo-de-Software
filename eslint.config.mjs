import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['packages/backend/tests/**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: [
      'js/recommended',
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
    env: {
      jest: true,
    },
  },
  {
    files: ['packages/frontend/src/**/*.{js,jsx,mjs,cjs}'],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
]);
