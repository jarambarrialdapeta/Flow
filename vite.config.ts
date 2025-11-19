import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to avoid TypeScript error with missing Node types
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Esto permite que process.env.API_KEY funcione en el código existente
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});