import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Garante que os caminhos relativos funcionem corretamente no deploy
});