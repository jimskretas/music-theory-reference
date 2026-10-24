import {
  type Note,
  letterAt,
  mod12,
  noteName,
  noteToPitchClass,
  noteWithLetter,
} from './notes';

export type Mode = 'major' | 'minor' | 'melodicMinor';

export interface Scale {
  root: Note;
  mode: Mode;
  notes: Note[];
}

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
/** Ascending melodic minor: natural minor with a raised 6th and 7th. */
const MELODIC_MINOR_INTERVALS = [0, 2, 3, 5, 7, 9, 11];

const INTERVALS_BY_MODE: Record<Mode, readonly number[]> = {
  major: MAJOR_INTERVALS,
  minor: NATURAL_MINOR_INTERVALS,
  melodicMinor: MELODIC_MINOR_INTERVALS,
};

const MODE_NAMES: Record<Mode, string> = {
  major: 'major',
  minor: 'natural minor',
  melodicMinor: 'melodic minor',
};

export function scaleIntervals(mode: Mode): readonly number[] {
  return INTERVALS_BY_MODE[mode];
}

function buildScale(root: Note, mode: Mode): Note[] {
  const intervals = scaleIntervals(mode);
  const rootPc = noteToPitchClass(root);

  return intervals.map((interval, i) => {
    const letter = letterAt(root.letter, i);
    const note = noteWithLetter(letter, mod12(rootPc + interval));
    if (note === null) {
      throw new Error(
        `Cannot spell ${noteName(root)} ${MODE_NAMES[mode]}: ${letter} needs more than a double accidental`,
      );
    }
    return note;
  });
}

export function getScale(root: Note, mode: Mode): Scale {
  return { root, mode, notes: buildScale(root, mode) };
}
