import { describe, expect, it } from 'vitest';
import { SCALES, detectScale, emptyMask, getScale, maskToPitchClasses, scaleMask } from './scales';

describe('catálogo SCALES', () => {
  it('cada escala empieza en 0, va en orden creciente, sin repetir y por debajo de 12', () => {
    for (const scale of SCALES) {
      expect(scale.intervals[0], scale.id).toBe(0);
      for (let i = 1; i < scale.intervals.length; i++) {
        expect(scale.intervals[i], scale.id).toBeGreaterThan(scale.intervals[i - 1]);
      }
      expect(scale.intervals.at(-1)!, scale.id).toBeLessThan(12);
    }
  });

  it('los ids no se repiten', () => {
    const ids = SCALES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getScale lanza un error con un id desconocido', () => {
    expect(() => getScale('mayor')).toThrow();
  });
});

describe('scaleMask', () => {
  it('Do mayor = C D E F G A B', () => {
    expect(maskToPitchClasses(scaleMask(0, 'major'))).toEqual([0, 2, 4, 5, 7, 9, 11]);
  });

  it('Re mayor incluye F# (6) y C# (1), no F (5) ni C (0)', () => {
    const pcs = maskToPitchClasses(scaleMask(2, 'major'));
    expect(pcs).toEqual([1, 2, 4, 6, 7, 9, 11]);
  });

  it('la cromática enciende las 12 notas', () => {
    expect(scaleMask(5, 'chromatic')).toEqual(emptyMask(true));
  });
});

describe('detectScale', () => {
  it('Do mayor y La menor natural son las mismas notas', () => {
    const matches = detectScale(scaleMask(0, 'major'));
    expect(matches).toContainEqual({ root: 0, scaleId: 'major' });
    expect(matches).toContainEqual({ root: 9, scaleId: 'naturalMinor' });
  });

  it('las notas de Do mayor coinciden con los 7 modos griegos', () => {
    const modes = detectScale(scaleMask(0, 'major')).map((m) => m.scaleId);
    for (const mode of ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'naturalMinor', 'locrian']) {
      expect(modes).toContain(mode);
    }
  });

  it('una combinación sin escala conocida devuelve lista vacía', () => {
    const mask = emptyMask();
    mask[0] = true;
    mask[1] = true;
    expect(detectScale(mask)).toEqual([]);
  });
});
