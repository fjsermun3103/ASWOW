import { describe, expect, it } from 'vitest';
import { createRng, mulberry32, randomSeed, weightedPick } from './random';

describe('mulberry32 / createRng', () => {
  it('misma semilla → misma secuencia', () => {
    const a = mulberry32(1234);
    const b = mulberry32(1234);
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it('semillas distintas → secuencias distintas', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()]);
  });

  it('next() siempre está en [0, 1) y su media ronda 0.5', () => {
    const rng = createRng(42);
    let sum = 0;
    for (let i = 0; i < 10_000; i++) {
      const x = rng.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      sum += x;
    }
    expect(sum / 10_000).toBeCloseTo(0.5, 1);
  });

  it('int(min, max) incluye ambos extremos y nunca se sale', () => {
    const rng = createRng(7);
    const seen = new Set<number>();
    for (let i = 0; i < 1_000; i++) {
      const n = rng.int(3, 5);
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(5);
      seen.add(n);
    }
    expect([...seen].sort()).toEqual([3, 4, 5]);
  });

  it('float(min, max) se queda dentro del rango', () => {
    const rng = createRng(9);
    for (let i = 0; i < 1_000; i++) {
      const x = rng.float(100, 200);
      expect(x).toBeGreaterThanOrEqual(100);
      expect(x).toBeLessThan(200);
    }
  });

  it('chance(0) nunca y chance(1) siempre', () => {
    const rng = createRng(5);
    for (let i = 0; i < 1_000; i++) {
      expect(rng.chance(0)).toBe(false);
      expect(rng.chance(1)).toBe(true);
    }
  });

  it('randomSeed() da enteros de 32 bits sin signo', () => {
    for (let i = 0; i < 100; i++) {
      const seed = randomSeed();
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(4294967296);
    }
  });
});

describe('weightedPick (ruleta ponderada)', () => {
  it('devuelve siempre un índice válido', () => {
    const rng = createRng(1);
    for (let i = 0; i < 1_000; i++) {
      const index = weightedPick([2, 5, 1], rng);
      expect([0, 1, 2]).toContain(index);
    }
  });

  it('nunca elige una opción con peso 0', () => {
    const rng = createRng(2);
    for (let i = 0; i < 1_000; i++) {
      expect(weightedPick([0, 1, 0, 1, 0], rng)).not.toBe(0);
      expect(weightedPick([0, 1, 0, 1, 0], rng) % 2).toBe(1);
    }
  });

  it('con un solo peso positivo siempre elige ese', () => {
    const rng = createRng(3);
    for (let i = 0; i < 100; i++) {
      expect(weightedPick([0, 0, 4, 0], rng)).toBe(2);
    }
  });

  it('respeta las proporciones: [1, 3] → ~25 % / ~75 %', () => {
    const rng = createRng(4);
    const counts = [0, 0];
    const draws = 10_000;
    for (let i = 0; i < draws; i++) {
      counts[weightedPick([1, 3], rng)]++;
    }
    expect(counts[0] / draws).toBeCloseTo(0.25, 1);
    expect(counts[1] / draws).toBeCloseTo(0.75, 1);
  });

  it('es reproducible: misma semilla → mismas elecciones', () => {
    const a = createRng(99);
    const b = createRng(99);
    const weights = [1, 2, 3, 4];
    for (let i = 0; i < 100; i++) {
      expect(weightedPick(weights, a)).toBe(weightedPick(weights, b));
    }
  });

  // Decisión pendiente (tuya): ¿qué debe pasar si todos los pesos son 0 o la lista está vacía?
  it.todo('caso límite: todos los pesos son 0 / lista vacía');
});
