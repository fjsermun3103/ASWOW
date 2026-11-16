import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// En local cargamos apps/api/.env; en producción (Render) las variables vienen del panel.
// Las variables ya definidas en el entorno tienen prioridad sobre las del archivo.
const envPath = fileURLToPath(new URL('../.env', import.meta.url));
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

export const env = {
  // API_PORT primero (local); PORT es el que define Render en producción.
  // Ojo: otras herramientas también usan PORT (p. ej. el lanzador de la web), por eso no basta con él.
  port: Number(process.env.API_PORT ?? process.env.PORT ?? 3001),
  databaseUrl: process.env.DATABASE_URL ?? '',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  cookieSecure: process.env.COOKIE_SECURE === 'true',
};
