import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuracion de Vite.
// El plugin de Vue permite compilar archivos .vue con template/script/style.
export default defineConfig({
  plugins: [vue()],
})
