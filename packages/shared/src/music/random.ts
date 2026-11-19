// Aleatoriedad reproducible: misma semilla → misma secuencia de números → misma melodía.
// NO es criptográficamente segura (no usar para contraseñas ni tokens).

/**
 * Generador pseudoaleatorio mulberry32.
 * Devuelve una función que, en cada llamada, da un decimal en [0, 1).
 *
 * Funcionamiento:
 *  1. `state` guarda un entero de 32 bits (empieza siendo la semilla).
 *  2. Cada llamada le suma una constante fija y "revuelve" sus bits
 *     con multiplicaciones (Math.imul), desplazamientos (>>>) y XOR (^).
 *  3. El resultado (entero sin signo de 32 bits) se divide entre 2^32 → [0, 1).
 *
 * @param seed  semilla (cualquier número; se reduce a 32 bits)
 */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0; // ">>> 0" convierte a entero de 32 bits sin signo
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1); // Math.imul = multiplicación entera de 32 bits
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // 4294967296 = 2^32
  };
}

/** Caja de herramientas aleatoria construida sobre un generador con semilla. */
export interface Rng {
  /** Decimal en [0, 1). */
  next(): number;
  /** Decimal en [min, max). */
  float(min: number, max: number): number;
  /** Entero entre min y max, AMBOS incluidos. */
  int(min: number, max: number): number;
  /** true con probabilidad p (0 = nunca, 1 = siempre). */
  chance(p: number): boolean;
}

/** Crea un Rng reproducible a partir de una semilla. */
export function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  return {
    next,
    float: (min, max) => min + next() * (max - min),
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    chance: (p) => next() < p,
  };
}

/**
 * Semilla nueva al azar (entero de 32 bits sin signo) para el botón "Randomizar".
 * Aquí SÍ usamos Math.random(): queremos que cada clic sea distinto.
 */
export function randomSeed(): number {
  return Math.floor(Math.random() * 4294967296) >>> 0;
}

/**
 * Ruleta ponderada: elige un ÍNDICE de `weights` con probabilidad proporcional a su peso.
 * Ejemplo: weights = [1, 3] → índice 0 sale ~25 % de las veces, índice 1 ~75 %.
 * Un peso 0 no debe salir nunca.
 *
 * Algoritmo de la ruleta:
 *   1. total = suma de todos los pesos.
 *   2. r = número al azar en [0, total)   →  rng.next() * total
 *   3. Recorrer los pesos acumulando: el primer índice en el que (acumulado > r) es el elegido.
 *      Visualmente: los pesos son tramos de una recta de 0 a total; r cae en uno de ellos.
 *
 *      pesos [1, 3]:  |-0-|-----1-----|
 *                     0   1           4      r = 2.7 → cae en el tramo del índice 1
 *
 * @param weights  pesos (>= 0), uno por opción
 * @param rng      generador con semilla (para que el resultado sea reproducible)
 * @returns        índice elegido
 */
export function weightedPick(weights: readonly number[], rng: Rng): number {
  // TODO(tú): implementa la ruleta (unas 6-8 líneas).
  // Decisión de diseño: ¿qué hacer si total <= 0 (todos los pesos son 0 o la lista está vacía)?
  throw new Error(`weightedPick por implementar (${weights.length} pesos, rng=${typeof rng})`);
}
