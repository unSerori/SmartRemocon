import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // 推奨設定
  js.configs.recommended, // jsの推奨設定
  ...tseslint.configs.recommended, // tsの推奨設定

  // プロジェクト全体ルール
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], // 対象
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // 'no-console': 'warn', // console.log警告
      'no-unused-vars': 'off', // 標準ルールは無効化
      '@typescript-eslint/no-unused-vars': [
        'warn', // またはerror
        {
          varsIgnorePattern: '^_', // 変数
          argsIgnorePattern: '^_', // 引数
          caughtErrorsIgnorePattern: '^_', // error
          destructuredArrayIgnorePattern: '^_', // 配列内
          args: 'after-used', // 複数引数について // after-used: 最後に使用された引数より後ろにある未使用引数は警告対象がとする
        },
      ],
    },
  },

  // 細分化ルール
  //

  // 競合を無効化
  eslintConfigPrettier,
]);
