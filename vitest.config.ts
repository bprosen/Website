import { defineConfig } from 'vitest/config';
import react from "@vitejs/plugin-react";
import path from 'path';
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./src/lib/setupTests.ts",
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "**/node_modules/**",
        "**/build/**",
        "**/ui/**",
        "**/coverage/**",
        "**/lib/**",
        "**/app/**",
        "**/types/**"
      ],
    },
  }
})