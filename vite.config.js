import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react' // Added this

export default defineConfig({
  plugins: [
    react(), // Added this
    tailwindcss(),
  ],
})