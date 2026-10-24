import {
  type Letter,
  type Note,
  SHARP_ORDER,
  FLAT_ORDER,
  ROOT_LABELS,
  accidentalOffset,
  mod12,
  noteFromLetter,
  noteName,
} from './notes';
import { type Mode, getScale } from './scales';

export interface KeySignature {
  accidental: '' | '♯' | '♭';
  notes: Note[];
}

/**
 * Conventional tonic spelling for each pitch class, indexed 0-11
 * (C, C♯/D♭, D, D♯/E♭, E, F, F♯/G♭, G, G♯/A♭, A, A♯/B♭, B).
 *
 * Where a pitch class has two valid spellings, we use the one with fewer
 * accidentals; ties are resolved so that parallel major and minor keys share
 * the same tonic spelling where possible.
 */
const MAJOR_TONICS: readonly Note[] = [
  noteFromLetter('C'),
  noteFromLetter('D', '♭'),
  noteFromLetter('D'),
  noteFromLetter('E', '♭'),
  noteFromLetter('E'),
  noteFromLetter('F'),
  noteFromLetter('F', '♯'),
  noteFromLetter('G'),
  noteFromLetter('A', '♭'),
  noteFromLetter('A'),
  noteFromLetter('B', '♭'),
  noteFromLetter('B'),
];

/**
 * Natural-minor tonics for each pitch class. Melodic minor uses the same
 * tonic spellings. C♯ minor, G♯ minor and B♭ minor are preferred over their
 * eight-/seven-flat enharmonic equivalents.
 */
const MINOR_TONICS: readonly Note[] = [
  noteFromLetter('C'),
  noteFromLetter('C', '♯'),
  noteFromLetter('D'),
  noteFromLetter('E', '♭'),
  noteFromLetter('E'),
  noteFromLetter('F'),
  noteFromLetter('F', '♯'),
  noteFromLetter('G'),
  noteFromLetter('G', '♯'),
  noteFromLetter('A'),
  noteFromLetter('B', '♭'),
  noteFromLetter('B'),
];

export function getTonic(pitchClass: number, mode: Mode): Note {
  const tonics = mode === 'major' ? MAJOR_TONICS : MINOR_TONICS;
  return tonics[mod12(pitchClass)];
}

/**
 * Label for the root selector, with the spelling actually used shown first,
 * e.g. "D♭ / C♯" in major and "C♯ / D♭" in minor.
 */
export function getTonicLabel(pitchClass: number, mode: Mode): string {
  const tonic = noteName(getTonic(pitchClass, mode));
  const alternates = ROOT_LABELS[mod12(pitchClass)].split(' / ').filter((label) => label !== tonic);
  return alternates.length === 0 ? tonic : `${tonic} / ${alternates[0]}`;
}

function orderBySignature(notes: Note[], order: readonly Letter[]): Note[] {
  return [...notes].sort((a, b) => order.indexOf(a.letter) - order.indexOf(b.letter));
}

export function getKeySignature(root: Note, mode: Mode): KeySignature {
  // Melodic minor shares the natural minor key signature: its raised 6th and
  // 7th are written as accidentals, not in the signature.
  const scale = getScale(root, mode === 'melodicMinor' ? 'minor' : mode);
  const sharps = scale.notes.filter((note) => accidentalOffset(note) > 0);
  const flats = scale.notes.filter((note) => accidentalOffset(note) < 0);

  if (sharps.length > 0 && flats.length === 0) {
    return { accidental: '♯', notes: orderBySignature(sharps, SHARP_ORDER) };
  }
  if (flats.length > 0 && sharps.length === 0) {
    return { accidental: '♭', notes: orderBySignature(flats, FLAT_ORDER) };
  }

  return { accidental: '', notes: [] };
}

export function keySignatureLabel(ks: KeySignature): string {
  if (ks.notes.length === 0) return 'No sharps or flats';
  return ks.notes.map(noteName).join(' ');
}
