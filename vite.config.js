import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  // In CI the workflow sets VITE_BASE_URL to /repo-name/
  // Locally it's undefined so Vite defaults to /
  base: process.env.VITE_BASE_URL ?? '/',
})
