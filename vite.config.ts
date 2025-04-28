import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
  test: {
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    testTimeout: 40000,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['default','text', 'html'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      exclude: [
        '**/node_modules/**',
        '**/*.spec.{ts,tsx,js,jsx}',
        '**/vite-env.d.ts',
        '**/*.d.ts',
        '**/types.ts',
      ],
      all: true,  // Asegúrate de que todos los archivos estén incluidos en el reporte de cobertura
      clean: false,  // Eliminar los resultados de cobertura anteriores
      cleanOnRerun: false,  // Limpiar en cada ejecución
    }
  },
});
