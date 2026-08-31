import { type Letter, type Note, LETTER_INDEX, LETTERS, mod12, noteFromLetter, noteToPitchClass } from './notes';

export type Mode = 'major' | 'minor';

export interface Scale {
  root: Note;
  mode: Mode;
  notes: Note[];
}

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export function scaleIntervals(mode: Mode): readonly number[] {
  return mode === 'major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
}

function letterAt(letter: Letter, stepsUp: number): Letter {
  const idx = LETTER_INDEX[letter];
  return LETTERS[((idx + stepsUp) % 7 + 7) % 7];
}

function accidentalForDiff(diff: number): '' | '♯' | '♭' {
  if (diff > 0) return '♯';
  if (diff < 0) return '♭';
  return '';
}

function buildScale(root: Note, mode: Mode): Note[] {
  const intervals = scaleIntervals(mode);
  const rootPc = noteToPitchClass(root);

  return intervals.map((interval, i) => {
    const targetPc = mod12(rootPc + interval);
    const letter = letterAt(root.letter, i);
    const letterPc = noteToPitchClass(noteFromLetter(letter, ''));
    let diff = mod12(targetPc - letterPc);
    if (diff > 6) diff -= 12;
    return noteFromLetter(letter, accidentalForDiff(diff));
  });
}

export function getScale(root: Note, mode: Mode): Scale {
  return { root, mode, notes: buildScale(root, mode) };
}
