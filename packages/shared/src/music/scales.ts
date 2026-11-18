// TODO RE-Documentar archivo entero y revisar todas las funciones
// Escalas musicales como listas de intervalos (en semitonos desde la tónica)
// y su conversión a "máscara": 12 interruptores, uno por clase de nota (0 = C … 11 = B).

/** 12 booleanos: posición i = ¿está permitida la clase de nota i? (0 = C/Do … 11 = B/Si) */
export type NoteMask = boolean[];

export interface ScaleDef {
  /** Identificador interno, estable (se guarda en las creaciones). */
  id: string;
  /** Nombre para mostrar en la interfaz. */
  name: string;
  /** Semitonos desde la tónica, ordenados, empezando en 0 y menores que 12. */
  intervals: readonly number[];
}

export const SCALES = [
  { id: 'major', name: 'Mayor (jónica)', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'naturalMinor', name: 'Menor natural (eólica)', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'harmonicMinor', name: 'Menor armónica', intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: 'melodicMinor', name: 'Menor melódica', intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: 'dorian', name: 'Dórica', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'phrygian', name: 'Frigia', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'lydian', name: 'Lidia', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian', name: 'Mixolidia', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'locrian', name: 'Locria', intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: 'majorPentatonic', name: 'Pentatónica mayor', intervals: [0, 2, 4, 7, 9] },
  { id: 'minorPentatonic', name: 'Pentatónica menor', intervals: [0, 3, 5, 7, 10] },
  { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  { id: 'wholeTone', name: 'Tonos enteros', intervals: [0, 2, 4, 6, 8, 10] },
  { id: 'chromatic', name: 'Cromática', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'phrygianDominant', name: 'Frigia dominante (flamenca)', intervals: [0, 1, 4, 5, 7, 8, 10] },
  { id: 'hungarianMinor', name: 'Húngara menor', intervals: [0, 2, 3, 6, 7, 8, 11] },
  { id: 'hirajoshi', name: 'Hirajōshi (japonesa)', intervals: [0, 2, 3, 7, 8] },
] as const satisfies readonly ScaleDef[];

/** Unión de todos los ids válidos: 'major' | 'naturalMinor' | … (calculada a partir de SCALES). */
export type ScaleId = (typeof SCALES)[number]['id'];

/** Busca una escala por id. Lanza un error si no existe (p. ej. datos guardados corruptos). */
export function getScale(id: string): ScaleDef {
  const scale = SCALES.find((s) => s.id === id);
  if (!scale) {
    throw new Error(`Escala desconocida: "${id}"`);
  }
  return scale;
}

/** Máscara con las 12 notas apagadas (o encendidas si `value = true`). */
export function emptyMask(value = false): NoteMask {
  return Array.from({ length: 12 }, () => value);
}

/**
 * Notas de una escala a partir de su tónica, como máscara de 12 interruptores.
 * Ejemplo: scaleMask(2, 'major') → Re mayor → enciende D, E, F#, G, A, B, C#.
 *
 * @param root     clase de nota de la tónica (0 = C … 11 = B)
 * @param scaleId  id de la escala (ver SCALES)
 */
export function scaleMask(root: number, scaleId: ScaleId | string): NoteMask {
  const mask = emptyMask();
  for (const interval of getScale(scaleId).intervals) {
    mask[(((root + interval) % 12) + 12) % 12] = true;
  }
  return mask;
}

/** Máscara → lista ordenada de clases de nota encendidas. [true,false,true,…] → [0, 2, …] */
export function maskToPitchClasses(mask: NoteMask): number[] {
  const result: number[] = [];
  mask.forEach((on, pitchClass) => {
    if (on) result.push(pitchClass);
  });
  return result;
}

/** ¿Dos máscaras tienen exactamente las mismas notas encendidas? */
export function masksEqual(a: NoteMask, b: NoteMask): boolean {
  for (let i = 0; i < 12; i++) {
    if (Boolean(a[i]) !== Boolean(b[i])) return false;
  }
  return true;
}

export interface ScaleMatch {
  root: number;
  scaleId: ScaleId;
}

/**
 * Qué escalas (tónica + tipo) tienen exactamente las notas encendidas en la máscara.
 * Devuelve una LISTA porque varias escalas comparten notas: Do mayor y La menor natural
 * son las mismas 7 notas (lo mismo ocurre con los modos griegos).
 * Lista vacía = combinación personalizada.
 */
export function detectScale(mask: NoteMask): ScaleMatch[] {
  const matches: ScaleMatch[] = [];
  for (const scale of SCALES) {
    for (let root = 0; root < 12; root++) {
      if (masksEqual(scaleMask(root, scale.id), mask)) {
        matches.push({ root, scaleId: scale.id });
      }
    }
  }
  return matches;
}
