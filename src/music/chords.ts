import { type Note, noteName, noteToPitchClass } from './notes';
import { type Mode, getScale } from './scales';

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented';

export interface DiatonicChord {
  degree: number;
  romanNumeral: string;
  name: string;
  notes: Note[];
  quality: ChordQuality;
}

const ROMAN_MAJOR: readonly string[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const ROMAN_MINOR: readonly string[] = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

const QUALITY_MAJOR: readonly ChordQuality[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];
const QUALITY_MINOR: readonly ChordQuality[] = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];

function triadNotes(scaleNotes: Note[], degree: number): Note[] {
  return [scaleNotes[degree % 7], scaleNotes[(degree + 2) % 7], scaleNotes[(degree + 4) % 7]];
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
  const numerals = mode === 'major' ? ROMAN_MAJOR : ROMAN_MINOR;
  const qualities = mode === 'major' ? QUALITY_MAJOR : QUALITY_MINOR;

  return scale.notes.map((_, i) => {
    const notes = triadNotes(scale.notes, i);
    const quality = qualities[i];
    return {
      degree: i + 1,
      romanNumeral: numerals[i],
      name: chordName(notes[0], quality),
      notes,
      quality,
    };
  });
}
