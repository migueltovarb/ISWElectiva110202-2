import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    isolate: true,
    env: {
      NODE_ENV: 'test',
    },
    coverage: {
      provider: 'istanbul',
      all: true,
      clean: false,
      cleanOnRerun: false,
      enabled: true,
      reporter: ['text', 'html'],
      reportsDirectory: path.resolve(__dirname, 'coverage'),
      exclude: [
        'node_modules/**',
     
       
        
      ],
      include: [
        '**/DoorManagement.tsx',
        '**/button.tsx',
        '**/input.tsx',
        '**/utils.ts',
        '**/Login.tsx',
        'src/components/GuestDashboard.tsx',
        'src/components/LanguageSwitcher.tsx',
        'src/components/ui/select.tsx',
        'src/contexts/**',
        'src/pages/Dashboard.tsx',
        'src/pages/EnvironmentalMonitoring.tsx',
        'src/pages/ExportRecords.tsx',
        'src/pages/GuestRegistration.tsx',
        'src/pages/Home.tsx',
        'src/pages/PasswordPolicy.tsx',
        'src/pages/RegistrationSuccess.tsx',
        'src/pages/UserManagement.tsx',
        'src/pages/UserRegistration.tsx'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        perFile: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
