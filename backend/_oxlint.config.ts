// oxlint.jsonの手動変換
import { defineConfig } from 'oxlint';

export default defineConfig({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
  },
  env: {
    node: true,
  },
});
