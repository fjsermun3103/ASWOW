import { pitchClass } from "./notes";

/** 12 booleanos: posición i = ¿está permitida la clase de nota i? (0 = C/Do … 11 = B/Si) */
export type NoteMask = boolean[];
/** De qué se compone cada escala*/
export interface ScaleDef {
  /** Identificador interno, estable (se guarda en las creaciones). */
  id: string;
  /** Nombre en español para mostrar en la interfaz. */
  name: string;
  /** Semitonos [0 - 11] que utiliza cada escala según los intervalos que posee. */
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

/** Unión de todos los ids válidos: 'major' | 'naturalMinor' | … */
export type ScaleId = (typeof SCALES)[number]['id'];

/** Dice la tónica (root) y el tipo de escala (scaleId) */
export interface ScaleMatch {
  root: number;
  scaleId: ScaleId;
}

/**
 **getScale() Busca la escala por el id recorriendo SCALES[]
 * Input -> id(string)
 * Id de la escala major, naturalMinor...
 * 
 * Outputs  -> scale(ScaleDef) | Error('Escala desconocida')
 * scale    -> Un objeto escala concreto del array SCALES que coincida con el id indicado.
 * Error    -> Si se ha introducido mal el nombre de la escala o no existe.
*/
export function getScale(id: string): ScaleDef {
  const scale = SCALES.find((s) => s.id === id);
  if (!scale) {
    throw new Error(`Escala desconocida: "${id}"`);
  }
  return scale;
}

/**
 **emptyMask()  Máscara con las 12 notas apagadas por defecto (o encendidas si `value = true`)
 * Input    -> value(boolean)
 * Estado de las 12 notas (encendida = true || apagada = false)
 * 
 * Output   -> Array del tipo NoteMask con los valores apagado o encendido. 
*/

export function emptyMask(value = false): NoteMask {
  return Array.from({ length: 12 }, () => value);
}

/**
 **scaleMask()  Notas de una escala a partir de su tónica, como máscara de 12 interruptores.
 * Inputs   -> root(int), scaleId(ScaleId | string)
 * root     -> Tónica de la escala (del 0-11).
 * scaleId  -> Id de la escala (en SCALES)       
 * 
 * Output   -> Máscara con las posiciones de la escala seleccionada encendidas. 
*/
export function scaleMask(root: number, scaleId: ScaleId | string): NoteMask {
  const mask = emptyMask();
  for (const interval of getScale(scaleId).intervals) {
    mask[pitchClass(root + interval)] = true;
  }
  return mask;
}

/**
 **maskToPitchClasses() Transforma las notas true en su clase de nota (0-11) según su índice
 * Input    -> mask(NoteMask)
 * mask     -> Recibe la máscara seleccionada (true, false, false, ...)    
 * 
 * Output   -> result(number[])
 * result   -> Máscara de notas de la escala pasadas a número (clase de nota) (0, 2, ...)
*/
export function maskToPitchClasses(mask: NoteMask): number[] {
  const result: number[] = [];
  mask.forEach((isOn, index) => {
    if (isOn) result.push(index);
  });
  return result;
}

/**
 **masksEqual() Compara si dos máscaras tienen exactamente las mismas notas encendidas
 * Input    -> a(NoteMask), b(NoteMask)
 * a, b     -> Dos máscaras de escalas. 
 * 
 * Output   -> boolean(la máscara es igual o no)
*/
export function masksEqual(a: NoteMask, b: NoteMask): boolean {
  for (let i = 0; i < 12; i++) {
    if (Boolean(a[i]) !== Boolean(b[i])) return false;
  }
  return true;
}



/**
 **detectScale() Dice qué escalas coinciden con las notas encendidas
 * Input    -> mask(NoteMask)
 * mask     -> Recibe la máscara seleccionada (true, false, false, ...)    
 * 
 * Output   -> matches(ScaleMatch[])
 * matches  -> Devuelve la tónica y el tipo de escala (scaleId) que hace match con la máscara 
 *             según las notas que tenga encendidas.
 *             Si la combinación es personalizada, la lista estará vacía
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
