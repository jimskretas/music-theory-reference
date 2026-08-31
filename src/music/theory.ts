import { type Note, type Mode, noteName, noteToPitchClass, mod12, noteFromLetter, LETTERS, LETTER_INDEX } from './notes';
import { getScale } from './scales';
import { getKeySignature, keySignatureLabel, type KeySignature } from './keySignatures';
import { getDiatonicChords, type DiatonicChord, type ChordQuality } from './chords';
import { type ProgressionDef, progressionsForMode } from './progressions';

export interface KeyInfo {
  root: Note;
  mode: Mode;
  scale: Note[];
  keySignature: KeySignature;
  keySignatureLabel: string;
  chords: DiatonicChord[];
}

export function getKeyInfo(root: Note, mode: Mode): KeyInfo {
  const scale = getScale(root, mode);
  const keySignature = getKeySignature(root, mode);
  const chords = getDiatonicChords(root, mode);
  return {
    root,
    mode,
    scale: scale.notes,
    keySignature,
    keySignatureLabel: keySignatureLabel(keySignature),
    chords,
  };
}

const ROMAN_VALUES: Record<string, number> = { I: 1, V: 5, X: 10 };

function parseRomanNumeral(numeral: string): { degree: number; quality: ChordQuality } | null {
  const clean = numeral.replace(/[°+]/g, '');
  const isUpper = clean[0] === clean[0].toUpperCase();
  let total = 0;
  for (const ch of clean) {
    const v = ROMAN_VALUES[ch.toUpperCase()];
    if (v === undefined) return null;
    total += v;
  }
  let quality: ChordQuality = isUpper ? 'major' : 'minor';
  if (numeral.includes('°')) quality = 'diminished';
  if (numeral.includes('+')) quality = 'augmented';
  return { degree: total, quality };
}

function buildChordName(root: Note, quality: ChordQuality): string {
  const name = noteName(root);
  switch (quality) {
    case 'major': return name;
    case 'minor': return `${name}m`;
    case 'diminished': return `${name}dim`;
    case 'augmented': return `${name}aug`;
  }
}

export function resolveProgression(progression: ProgressionDef, chords: DiatonicChord[], scale: Note[]): string[] {
  return progression.numerals.map((numeral) => {
    const chord = chords.find((c) => c.romanNumeral === numeral);
    if (chord) return chord.name;
    const parsed = parseRomanNumeral(numeral);
    if (parsed && parsed.degree >= 1 && parsed.degree <= 7) {
      const root = scale[parsed.degree - 1];
      return buildChordName(root, parsed.quality);
    }
    return numeral;
  });
}

export function getProgressionsForMode(mode: Mode): ProgressionDef[] {
  return progressionsForMode(mode);
}

export { type ProgressionDef } from './progressions';
export { type DiatonicChord } from './chords';
export { type KeySignature } from './keySignatures';
export { type Mode } from './scales';
