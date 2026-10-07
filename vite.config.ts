import { defineConfig } from 'vite';

/**
 * Aperçu live (page web animée) :
 *   npm run preview:live   →  http://localhost:5173
 *
 * `allowedHosts: true` autorise l'accès via un hôte de prévisualisation
 * (sandbox / proxy) — configuration de dev uniquement.
 */
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
