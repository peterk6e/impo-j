import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js, TypeScript, and recommended plugins
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.extends("eslint:recommended"),
  ...compat.extends("plugin:@typescript-eslint/recommended"),
  ...compat.extends("plugin:react/recommended"),
  ...compat.extends("plugin:react-hooks/recommended"),
  ...compat.extends("plugin:prettier/recommended"),

  {
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
    rules: {
      // Formatting & consistency
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "comma-dangle": ["error", "always-multiline"],
      curly: ["error", "all"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],

      // TypeScript
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": ["warn"],

      // React
      "react/react-in-jsx-scope": "off", // Not needed in Next.js 13+
      "react/prop-types": "off", // Using TS for types
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General best practices
      eqeqeq: ["error", "always"], // enforce strict equality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": ["error"],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
