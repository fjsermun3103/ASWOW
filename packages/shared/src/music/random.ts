// Aleatoriedad reproducible: misma semilla → misma secuencia de números → misma melodía.
// ⚠️ NO es criptográficamente segura: no usar para contraseñas, tokens ni nada de seguridad
//    (para eso, el módulo `crypto` de Node).

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

/**
 **createRng() Crea un generador de números aleatorios a partir de una semilla
 * Input    -> seed(int)
 * seed     -> Número a partir del cual empezará el Rng.
 *             Misma semilla → misma secuencia de números.
 *
 * Output   -> Rng
 * Rng      -> Objeto con next, float, int y chance. Todos sacan sus números
 *             de un mismo mulberry32 iniciado con `seed`.
*/
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
 **randomSeed() Crea una semilla nueva al azar (para el botón "Randomizar")
 *               Usa Math.random() a propósito: cada llamada da un valor distinto
 *               y NO es reproducible (justo lo que queremos al randomizar).
 *
 * Output   -> seed(int)
 * seed     -> Entero sin signo de 32 bits (de 0 a 4.294.967.295)
*/
export function randomSeed(): number {
  return Math.floor(Math.random() * 4294967296) >>> 0;
}

/**
 **weightedPick() Ruleta ponderada: elige un ÍNDICE de `weights` con probabilidad proporcional
 **               a su peso. Un peso 0 no sale nunca.
 *
 * Cómo funciona (regla de colores): cada peso es un tramo de una regla que mide `total`.
 * Se clava un alfiler al azar (r) y se recorre la regla tramo a tramo: el primer tramo
 * cuyo final queda por encima del alfiler es el elegido. Ej: [1, 3] → 0 ~25 %, 1 ~75 %.
 *
 * Inputs   -> weights(number[]), rng(Rng)
 * weights  -> Pesos >= 0, uno por opción
 * rng      -> Generador con semilla (para que el resultado sea reproducible)
 *
 * Output   -> Int | Error
 * Int      -> Índice elegido.
 *             Si todos los pesos son 0, todas las opciones valen lo mismo (al azar).
 * Error    -> Si la lista de pesos está vacía (no hay ninguna opción).
*/
export function weightedPick(weights: readonly number[], rng: Rng): number {
  const total = weights.reduce((suma, w) => suma + w, 0);
  if(total <= 0) {
    // Sin opciones no hay nada que elegir: es un error de programación.
    if (weights.length === 0) {
      throw new Error('weightedPick: la lista de pesos está vacía');
    }
    // Todos los pesos son 0 → todas las opciones valen lo mismo.
    return rng.int(0, weights.length - 1);
  }

  const r = rng.next() * total;
  let finDelTramo = 0;

  for (let i = 0; i < weights.length; i++) {
    finDelTramo += weights[i];
    if (finDelTramo > r) {
      return i;
    }
  }

  // Red de seguridad: por redondeo de decimales el bucle podría no devolver nada;
  // en ese caso elegimos el último tramo que mida algo.
  for (let i = weights.length - 1; i >= 0; i--) {
    if (weights[i] > 0) return i;
  }

  return 0;
}
