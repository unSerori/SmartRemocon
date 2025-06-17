import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config([
  // 推奨設定
  js.configs.recommended, // jsの推奨設定
  ...tseslint.configs.recommendedTypeChecked, // tsの推奨設定

  // プロジェクト全体ルール
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], // 対象
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
      '@typescript-eslint/no-floating-promises': 'warn', // promiseのawai漏れ
      '@typescript-eslint/no-unsafe-argument': 'warn', // 特定の型が期待されてるのにanyを渡していいわけないだろ
    },
  },

  // 細分化ルール
  //

  // 競合を無効化
  eslintPluginPrettierRecommended,
]);
