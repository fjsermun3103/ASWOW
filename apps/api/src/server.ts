import { buildApp } from './app';
import { env } from './env';

const app = await buildApp();

// 0.0.0.0 = escuchar en todas las interfaces de red (necesario en Render).
await app.listen({ port: env.port, host: '0.0.0.0' });
