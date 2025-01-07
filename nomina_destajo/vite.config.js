import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
/*
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
*/

export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 3000,  // Usa el valor de la variable de entorno, o 3000 como predeterminado
  },
});
