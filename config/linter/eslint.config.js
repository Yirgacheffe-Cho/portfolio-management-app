import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier'; // ✅ Prettier 플러그인 추가
import tsParser from '@typescript-eslint/parser';
import ts from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      '@typescript-eslint': ts,
      prettier, // ✅ 여기에 추가
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // ✅ React 17 이상에서는 필요 없음
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': 'error', // ✅ Prettier 포맷팅 강제로 체크
    },
  },
];
