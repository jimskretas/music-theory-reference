import { type Note, letterAt, mod12, noteName, noteToPitchClass, noteWithLetter } from './notes';
import { type Mode, getScale } from './scales';

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented';

export interface SecondaryDominant {
  /** Functional label, e.g. "V7/ii". */
  romanNumeral: string;
  /** Chord symbol, e.g. "A7". */
  name: string;
  notes: Note[];
}

export interface DiatonicChord {
  degree: number;
  romanNumeral: string;
  name: string;
  notes: Note[];
  quality: ChordQuality;
  /**
   * V7 of this chord, or null for the tonic and diminished degrees, which are
   * not normally tonicized (see the standard secondary-dominant definition).
   */
  secondaryDominant: SecondaryDominant | null;
}

const ROMAN_DEGREES: readonly string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

/** Builds the roman numeral for a triad from its degree and actual quality. */
function romanNumeralFor(degree: number, quality: ChordQuality): string {
  const base = ROMAN_DEGREES[degree % 7];
  switch (quality) {
    case 'major':
      return base;
    case 'minor':
      return base.toLowerCase();
    case 'diminished':
      return `${base.toLowerCase()}°`;
    case 'augmented':
      return `${base}+`;
  }
}

function triadNotes(scaleNotes: Note[], degree: number): Note[] {
  return [scaleNotes[degree % 7], scaleNotes[(degree + 2) % 7], scaleNotes[(degree + 4) % 7]];
}

const DOMINANT_SEVENTH_INTERVALS = [0, 4, 7, 10];

/** Spells a tertian chord (root, third, fifth, seventh...) from a root. */
function spellTertianChord(root: Note, intervals: readonly number[]): Note[] {
  const rootPc = noteToPitchClass(root);

  return intervals.map((interval, i) => {
    const letter = letterAt(root.letter, i * 2);
    const note = noteWithLetter(letter, mod12(rootPc + interval));
    if (note === null) {
      throw new Error(`Cannot spell ${noteName(root)} chord: ${letter} needs more than a double accidental`);
    }
    return note;
  });
}

/**
 * Returns the dominant seventh chord a perfect fifth above `target`, i.e. the
 * secondary dominant V7/<targetRoman> that tonicizes it.
 */
export function secondaryDominantOf(target: Note, targetRoman: string): SecondaryDominant {
  const dominantLetter = letterAt(target.letter, 4);
  const dominantRoot = noteWithLetter(dominantLetter, mod12(noteToPitchClass(target) + 7));
  if (dominantRoot === null) {
    throw new Error(`Cannot spell the dominant of ${noteName(target)}`);
  }

  return {
    romanNumeral: `V7/${targetRoman}`,
    name: `${noteName(dominantRoot)}7`,
    notes: spellTertianChord(dominantRoot, DOMINANT_SEVENTH_INTERVALS),
  };
}

function chordQuality(notes: Note[]): ChordQuality {
  const root = noteToPitchClass(notes[0]);
  const third = noteToPitchClass(notes[1]);
  const fifth = noteToPitchClass(notes[2]);
  const thirdInt = (third - root + 12) % 12;
  const fifthInt = (fifth - root + 12) % 12;
  if (thirdInt === 4 && fifthInt === 7) return 'major';
  if (thirdInt === 3 && fifthInt === 7) return 'minor';
  if (thirdInt === 3 && fifthInt === 6) return 'diminished';
  if (thirdInt === 4 && fifthInt === 8) return 'augmented';
  return 'major';
}

function chordName(root: Note, quality: ChordQuality): string {
  const name = noteName(root);
  switch (quality) {
    case 'major':
      return name;
    case 'minor':
      return `${name}m`;
    case 'diminished':
      return `${name}dim`;
    case 'augmented':
      return `${name}aug`;
  }
}

export function getDiatonicChords(root: Note, mode: Mode): DiatonicChord[] {
  const scale = getScale(root, mode);

  return scale.notes.map((_, i) => {
    const notes = triadNotes(scale.notes, i);
    const quality = chordQuality(notes);
    const romanNumeral = romanNumeralFor(i, quality);
    // Applied dominants normally tonicize stable major/minor triads, so the
    // tonic, diminished and augmented degrees do not get one.
    const secondaryDominant =
      i > 0 && quality !== 'diminished' && quality !== 'augmented'
        ? secondaryDominantOf(notes[0], romanNumeral)
        : null;
    return {
      degree: i + 1,
      romanNumeral,
      name: chordName(notes[0], quality),
      notes,
      quality,
      secondaryDominant,
    };
  });
}
