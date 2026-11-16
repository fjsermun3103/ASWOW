import { defineConfig } from 'vitest/config';

// Cada subproyecto tiene sus propios tests; `npm test` en la raíz los ejecuta todos.
export default defineConfig({
  test: {
    projects: ['packages/shared', 'apps/web', 'apps/api'],
    passWithNoTests: true, // la web aún no tiene tests (llegan en la fase 2)
  },
});
