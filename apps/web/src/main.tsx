import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// React toma el control del <div id="root"> de index.html y dibuja <App /> dentro.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
