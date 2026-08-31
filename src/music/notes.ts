export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export type Accidental = '' | '♯' | '♭';

export interface Note {
  letter: Letter;
  accidental: Accidental;
}

export const LETTERS: readonly Letter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const LETTER_INDEX: Record<Letter, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

const LETTER_TO_PC: Record<Letter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const ACCIDENTAL_TO_PC: Record<Accidental, number> = {
  '': 0,
  '♯': 1,
  '♭': -1,
};

export function noteToPitchClass(note: Note): number {
  return mod12(LETTER_TO_PC[note.letter] + ACCIDENTAL_TO_PC[note.accidental]);
}

export function noteName(note: Note): string {
  return `${note.letter}${note.accidental}`;
}

export function noteEquals(a: Note, b: Note): boolean {
  return a.letter === b.letter && a.accidental === b.accidental;
}

export function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function isEnharmonic(a: Note, b: Note): boolean {
  return noteToPitchClass(a) === noteToPitchClass(b);
}

export const NOTE_NAMES: readonly Note[] = [
  { letter: 'C', accidental: '' },
  { letter: 'C', accidental: '♯' },
  { letter: 'D', accidental: '' },
  { letter: 'D', accidental: '♯' },
  { letter: 'E', accidental: '' },
  { letter: 'F', accidental: '' },
  { letter: 'F', accidental: '♯' },
  { letter: 'G', accidental: '' },
  { letter: 'G', accidental: '♯' },
  { letter: 'A', accidental: '' },
  { letter: 'A', accidental: '♯' },
  { letter: 'B', accidental: '' },
];

export const ROOT_LABELS: readonly string[] = [
  'C',
  'C♯ / D♭',
  'D',
  'D♯ / E♭',
  'E',
  'F',
  'F♯ / G♭',
  'G',
  'G♯ / A♭',
  'A',
  'A♯ / B♭',
  'B',
];

export const SHARP_ORDER: readonly Letter[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
export const FLAT_ORDER: readonly Letter[] = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];

export function noteFromLetter(letter: Letter, accidental: Accidental = ''): Note {
  return { letter, accidental };
}
