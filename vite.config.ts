import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const plugins = [react()];
  if (command === 'build') {
    return {
      plugins,
      base: '/react-node-chat-frontend/',
    };
  }
  return {
    plugins,
  };
});
