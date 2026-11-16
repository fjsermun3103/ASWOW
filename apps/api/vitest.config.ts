import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Los tests de la API se ejecutan de uno en uno: cuando usen la base de datos no se pisarán.
    fileParallelism: false,
  },
});
