import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { APP_NAME } from '@aswow/shared';
import { env } from './env';

interface BuildOptions {
  logger?: boolean;
}

// Construye la aplicación SIN arrancarla: así los tests pueden usar app.inject()
// para simular peticiones sin abrir ningún puerto.
export async function buildApp({ logger = true }: BuildOptions = {}) {
  const app = Fastify({
    logger,
    bodyLimit: 512 * 1024, // 512 KB: suficiente para una creación, rechaza abusos
  });

  await app.register(cors, { origin: env.corsOrigins, credentials: true });
  await app.register(cookie);

  // La web llama a esta ruta al cargar para "despertar" la API si Render la ha dormido.
  app.get('/health', async () => ({ status: 'ok', app: APP_NAME }));

  return app;
}
