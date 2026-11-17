// Notas musicales representadas como números MIDI.
//   60 = C4 (Do central del piano)   69 = A4 (La de afinación, 440 Hz)
//   +1 = un semitono   +12 = una octava

/** Nombres internos (estándar internacional). Índice = clase de nota (0..11). */
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/** Nombres para mostrar en la interfaz (solfeo en español). */
export const NOTE_NAMES_ES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

/** Nota de referencia de la afinación estándar: A4 = MIDI 69 = 440 Hz. */
export const A4_MIDI = 69;
export const A4_FREQ = 440;

/**
 **pitchClass() transforma la nota midi a una sola octava
 * Input -> midi(INT)
 * Nota MIDI (por ejemplo A4=69)
 * 
 * Output -> pitchNote(INT)
 * La nota equivalente independientemente de la escala
*/
export function pitchClass(midi: number): number {
  const pitchNote = ((midi % 12) + 12) % 12;
  return pitchNote;
}

/**
 **octaveOf() muestra la octava a la que pertenece la nota MIDI
 * Input -> midi(INT)
 * Nota MIDI (por ejemplo C3=48)
 * 
 * Output -> octave(INT)
 * Octava en notación científica: MIDI 48 -> 3
*/
export function octaveOf(midi: number): number {
  const octave = Math.floor(midi / 12) - 1;
  return octave;
}

/**
 **midiToName() Transforma la nota MIDI a nombre en NOTE_NAMES si es = false
 **             o en NOTE_NAMES_ES si es=true 
 * Input -> midi(INT), es(BOOL)
 * Nota MIDI (por ejemplo C3=48)
 * es= Nombre de la nota en Español (Do3)
 * 
 * Output -> name(string)
 * Nombre de la nota transformado. 48 -> "C3". Con `es = true`: 48 -> "Do3"
*/
export function midiToName(midi: number, es = false): string {
  const names = es ? NOTE_NAMES_ES : NOTE_NAMES;
  const name = `${names[pitchClass(midi)]}${octaveOf(midi)}`;
  return name;
}

/**
 **nameToMidi() Transforma el nombre de la nota a MIDI. Acepta las notas de A-G
 **             sostenidos # y bemoles b desde la octava -1.
 * 
 * Input -> name(string)
 * Nombre de la nota en notación científica (por ejemplo C3=48)
 * 
 * Outputs:
 * Error() Si el nombre de la nota no se encuentra en match
 * noteMidi(Int): Nota MIDI equivalente a la nota introducida
*/

export function nameToMidi(name: string): number {
  const match = /^([A-G])(#|b)?(-?\d+)$/.exec(name.trim());
  if (!match) {
    throw new Error(`Nombre de nota no válido: "${name}"`);
  }
  const [, letter, accidental, octave] = match;
  const base = NOTE_NAMES.indexOf(letter as NoteName);
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  const noteMidi = (Number(octave) + 1) * 12 + base + shift;
  return noteMidi;
}

/**
 * MIDI → frecuencia en hercios (Hz).
 *
 * Idea: cada octava (12 semitonos) DUPLICA la frecuencia, y los 12 semitonos son iguales,
 * así que cada semitono multiplica la frecuencia por 2^(1/12) ≈ 1.0595.
 * Tomando como referencia A4 (MIDI 69) = 440 Hz:
 *
 *     frecuencia = a4 · 2^((midi − 69) / 12)
 *
 * Ejemplos: 69 → 440, 81 → 880 (una octava arriba), 57 → 220, 60 → ≈261.63.
 *
 * @param midi  número de nota MIDI (puede tener decimales, p. ej. para vibrato)
 * @param a4    frecuencia de afinación del La4 (por defecto 440 Hz)
 */
export function midiToFreq(midi: number, a4: number = A4_FREQ): number {
  // TODO(tú): implementa la fórmula de arriba (una línea).
  // Pistas: en JavaScript la potencia se escribe `base ** exponente` (o Math.pow(base, exponente)),
  // y tienes A4_MIDI ya definido arriba para no escribir 69 "a pelo".
  throw new Error(`midiToFreq por implementar (midi=${midi}, a4=${a4})`);
}
