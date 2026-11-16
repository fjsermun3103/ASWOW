import { useEffect, useState } from 'react';
import { APP_NAME } from '@aswow/shared';

type ApiStatus = 'comprobando' | 'ok' | 'sin conexión';

// Pantalla provisional de la fase 1: demuestra que
//  1) la web importa código de @aswow/shared (monorepo bien enlazado)
//  2) la web llega a la API a través del proxy /api (mismo origen)
export function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('comprobando');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => setApiStatus(res.ok ? 'ok' : 'sin conexión'))
      .catch(() => setApiStatus('sin conexión'));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <h1>{APP_NAME}</h1>
      <p>Randomizador de notas con sintetizador propio.</p>
      <p>
        Estado de la API: <strong>{apiStatus}</strong>
      </p>
    </main>
  );
}
