import { describe, expect, it } from 'vitest';
import { midiToFreq, midiToName, nameToMidi, octaveOf, pitchClass } from './notes';

describe('pitchClass y octaveOf', () => {
  it('C4 (60) es clase 0, octava 4', () => {
    expect(pitchClass(60)).toBe(0);
    expect(octaveOf(60)).toBe(4);
  });

  it('A4 (69) es clase 9, octava 4', () => {
    expect(pitchClass(69)).toBe(9);
    expect(octaveOf(69)).toBe(4);
  });

  it('funciona con números negativos', () => {
    expect(pitchClass(-1)).toBe(11);
  });
});

describe('midiToName y nameToMidi', () => {
  it('convierte MIDI a nombre', () => {
    expect(midiToName(60)).toBe('C4');
    expect(midiToName(61)).toBe('C#4');
    expect(midiToName(60, true)).toBe('Do4');
  });

  it('convierte nombre a MIDI (sostenidos y bemoles)', () => {
    expect(nameToMidi('C4')).toBe(60);
    expect(nameToMidi('C#4')).toBe(61);
    expect(nameToMidi('Db4')).toBe(61);
    expect(nameToMidi('A4')).toBe(69);
  });

  it('ida y vuelta da el mismo número en todo el rango MIDI', () => {
    for (let midi = 0; midi <= 127; midi++) {
      expect(nameToMidi(midiToName(midi))).toBe(midi);
    }
  });

  it('rechaza nombres mal escritos', () => {
    expect(() => nameToMidi('H4')).toThrow();
  });
});

describe('midiToFreq', () => {
  it('A4 (69) = 440 Hz', () => {
    expect(midiToFreq(69)).toBe(440);
  });

  it('una octava arriba duplica y una abajo divide entre dos', () => {
    expect(midiToFreq(81)).toBeCloseTo(880, 6);
    expect(midiToFreq(57)).toBeCloseTo(220, 6);
  });

  it('C4 (60) ≈ 261.63 Hz', () => {
    expect(midiToFreq(60)).toBeCloseTo(261.63, 2);
  });

  it('respeta otra afinación (A4 = 432 Hz)', () => {
    expect(midiToFreq(69, 432)).toBe(432);
  });
});
