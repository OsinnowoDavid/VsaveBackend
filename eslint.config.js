import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals"; // Use to specify environments like node

export default defineConfig(
    {
        // 1. Files to ignore globally
        ignores: ["dist/*", "node_modules/", "coverage/"],
    },
    {
        // 2. Base configuration for all JS/TS files
        // Apply ESLint's recommended rules
        ...eslint.configs.recommended,
    },
    {
        // 3. Configuration specific to TypeScript files
        files: ["**/*.ts"],
        extends: [
            // Recommended rules for TypeScript
            ...tseslint.configs.recommended,
            // Strict rules for better code quality (highly recommended)
            ...tseslint.configs.strict,
        ],
        languageOptions: {
            // Use the TypeScript parser
            parser: tseslint.parser,
            parserOptions: {
                // Specify the TypeScript config file for type-aware linting
                project: "./tsconfig.json",
                ecmaVersion: "latest",
                sourceType: "module",
            },
            // Define global variables for a Node.js environment
            globals: {
                ...globals.node,
            },
        },
        rules: {
            // Custom rules and overrides can go here
            // For a Node.js backend, you might want to allow console.log
            "no-console": "off",
            // Mongoose/Express often use 'any' in controllers/middleware; consider relaxing this:
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        // 4. Prettier configuration
        files: ["**/*.ts"], // Apply Prettier to your source files
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            // Use the 'prettier/prettier' rule to format files
            "prettier/prettier": "error",
            // Turn off ESLint rules that conflict with Prettier
            ...prettierConfig.rules,
        },
    },
);
