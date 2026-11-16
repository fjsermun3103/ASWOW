import { defineConfig } from 'tsup';

// Empaqueta la API en dist/server.js para producción (Render).
// @aswow/shared se incluye dentro porque Node no ejecuta su TypeScript directamente.
export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node20',
  outDir: 'dist',
  clean: true,
  noExternal: ['@aswow/shared'],
});
