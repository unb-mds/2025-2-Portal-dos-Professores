import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione esta seção para configurar o servidor de desenvolvimento
  server: {
    // Esta parte é crucial para o hot-reload funcionar com Docker
    watch: {
      usePolling: true,
    },
    host: true, // Garante que o servidor seja acessível externamente (pelo Docker)
    strictPort: true, // Garante que use sempre a porta 5173
  },
})
