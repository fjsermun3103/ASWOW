import { describe, expect, it } from 'vitest';
import { APP_NAME } from './index';

// Primer test del paquete compartido. En la fase 2 aquí se añadirán los tests
// de notas (midiToFreq), escalas y el generador aleatorio.
describe('@aswow/shared', () => {
  it('exporta el nombre de la app', () => {
    expect(APP_NAME).toBe('ASWOW');
  });
});
