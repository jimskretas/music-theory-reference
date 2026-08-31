import { type Letter, type Note, SHARP_ORDER, FLAT_ORDER, noteFromLetter, noteToPitchClass, mod12 } from './notes';
import { type Mode, getScale } from './scales';

export interface KeySignature {
  accidental: '' | '♯' | '♭';
  notes: Note[];
}

export function getKeySignature(root: Note, mode: Mode): KeySignature {
  const scale = getScale(root, mode);
  const sharps: Note[] = [];
  const flats: Note[] = [];

  for (const note of scale.notes) {
    if (note.accidental === '♯') sharps.push(note);
    else if (note.accidental === '♭') flats.push(note);
  }

  if (sharps.length > 0 && flats.length === 0) {
    const ordered = SHARP_ORDER.filter((l) => sharps.some((n) => n.letter === l)).map((l) => noteFromLetter(l, '♯'));
    return { accidental: '♯', notes: ordered };
  }
  if (flats.length > 0 && sharps.length === 0) {
    const ordered = FLAT_ORDER.filter((l) => flats.some((n) => n.letter === l)).map((l) => noteFromLetter(l, '♭'));
    return { accidental: '♭', notes: ordered };
  }

  return { accidental: '', notes: [] };
}

export function keySignatureLabel(ks: KeySignature): string {
  if (ks.notes.length === 0) return 'No sharps or flats';
  const symbol = ks.accidental;
  return ks.notes.map((n) => `${n.letter}${symbol}`).join(' ');
}
