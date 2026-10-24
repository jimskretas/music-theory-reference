import { describe, it, expect } from 'vitest';
import { getScale } from '@/music/scales';
import { noteName, noteFromLetter, noteToPitchClass, letterAt, type Note } from '@/music/notes';
import { getKeySignature, keySignatureLabel, getTonic, getTonicLabel } from '@/music/keySignatures';
import { getDiatonicChords } from '@/music/chords';
import { getKeyInfo, resolveProgression } from '@/music/theory';
import { PROGRESSIONS } from '@/music/progressions';

function names(notes: Note[]): string[] {
  return notes.map(noteName);
}

const MAJOR_KEYS: Array<{ tonic: string; scale: string[]; signature: string }> = [
  { tonic: 'C', scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], signature: 'No sharps or flats' },
  { tonic: 'D♭', scale: ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'], signature: 'B♭ E♭ A♭ D♭ G♭' },
  { tonic: 'D', scale: ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'], signature: 'F♯ C♯' },
  { tonic: 'E♭', scale: ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'], signature: 'B♭ E♭ A♭' },
  { tonic: 'E', scale: ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'], signature: 'F♯ C♯ G♯ D♯' },
  { tonic: 'F', scale: ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'], signature: 'B♭' },
  { tonic: 'F♯', scale: ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'], signature: 'F♯ C♯ G♯ D♯ A♯ E♯' },
  { tonic: 'G', scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'], signature: 'F♯' },
  { tonic: 'A♭', scale: ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'], signature: 'B♭ E♭ A♭ D♭' },
  { tonic: 'A', scale: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'], signature: 'F♯ C♯ G♯' },
  { tonic: 'B♭', scale: ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'], signature: 'B♭ E♭' },
  { tonic: 'B', scale: ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'], signature: 'F♯ C♯ G♯ D♯ A♯' },
];

const MINOR_KEYS: Array<{ tonic: string; scale: string[]; signature: string }> = [
  { tonic: 'C', scale: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'], signature: 'B♭ E♭ A♭' },
  { tonic: 'C♯', scale: ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A', 'B'], signature: 'F♯ C♯ G♯ D♯' },
  { tonic: 'D', scale: ['D', 'E', 'F', 'G', 'A', 'B♭', 'C'], signature: 'B♭' },
  { tonic: 'E♭', scale: ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'], signature: 'B♭ E♭ A♭ D♭ G♭ C♭' },
  { tonic: 'E', scale: ['E', 'F♯', 'G', 'A', 'B', 'C', 'D'], signature: 'F♯' },
  { tonic: 'F', scale: ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E♭'], signature: 'B♭ E♭ A♭ D♭' },
  { tonic: 'F♯', scale: ['F♯', 'G♯', 'A', 'B', 'C♯', 'D', 'E'], signature: 'F♯ C♯ G♯' },
  { tonic: 'G', scale: ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F'], signature: 'B♭ E♭' },
  { tonic: 'G♯', scale: ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E', 'F♯'], signature: 'F♯ C♯ G♯ D♯ A♯' },
  { tonic: 'A', scale: ['A', 'B', 'C', 'D', 'E', 'F', 'G'], signature: 'No sharps or flats' },
  { tonic: 'B♭', scale: ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A♭'], signature: 'B♭ E♭ A♭ D♭ G♭' },
  { tonic: 'B', scale: ['B', 'C♯', 'D', 'E', 'F♯', 'G', 'A'], signature: 'F♯ C♯' },
];

/** Ascending melodic minor; the signature is the parallel natural minor's. */
const MELODIC_MINOR_KEYS: Array<{ tonic: string; scale: string[]; signature: string }> = [
  { tonic: 'C', scale: ['C', 'D', 'E♭', 'F', 'G', 'A', 'B'], signature: 'B♭ E♭ A♭' },
  { tonic: 'C♯', scale: ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯', 'B♯'], signature: 'F♯ C♯ G♯ D♯' },
  { tonic: 'D', scale: ['D', 'E', 'F', 'G', 'A', 'B', 'C♯'], signature: 'B♭' },
  { tonic: 'E♭', scale: ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C', 'D'], signature: 'B♭ E♭ A♭ D♭ G♭ C♭' },
  { tonic: 'E', scale: ['E', 'F♯', 'G', 'A', 'B', 'C♯', 'D♯'], signature: 'F♯' },
  { tonic: 'F', scale: ['F', 'G', 'A♭', 'B♭', 'C', 'D', 'E'], signature: 'B♭ E♭ A♭ D♭' },
  { tonic: 'F♯', scale: ['F♯', 'G♯', 'A', 'B', 'C♯', 'D♯', 'E♯'], signature: 'F♯ C♯ G♯' },
  { tonic: 'G', scale: ['G', 'A', 'B♭', 'C', 'D', 'E', 'F♯'], signature: 'B♭ E♭' },
  { tonic: 'G♯', scale: ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯', 'F𝄪'], signature: 'F♯ C♯ G♯ D♯ A♯' },
  { tonic: 'A', scale: ['A', 'B', 'C', 'D', 'E', 'F♯', 'G♯'], signature: 'No sharps or flats' },
  { tonic: 'B♭', scale: ['B♭', 'C', 'D♭', 'E♭', 'F', 'G', 'A'], signature: 'B♭ E♭ A♭ D♭ G♭' },
  { tonic: 'B', scale: ['B', 'C♯', 'D', 'E', 'F♯', 'G♯', 'A♯'], signature: 'F♯ C♯' },
];


describe('Major scales', () => {
  it('C major has no accidentals', () => {
    expect(names(getScale(noteFromLetter('C'), 'major').notes)).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('G major has F♯', () => {
    expect(names(getScale(noteFromLetter('G'), 'major').notes)).toEqual(['G', 'A', 'B', 'C', 'D', 'E', 'F♯']);
  });

  it('D major has F♯ and C♯', () => {
    expect(names(getScale(noteFromLetter('D'), 'major').notes)).toEqual(['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯']);
  });

  it('F major uses B♭', () => {
    expect(names(getScale(noteFromLetter('F'), 'major').notes)).toEqual(['F', 'G', 'A', 'B♭', 'C', 'D', 'E']);
  });

  it('B♭ major uses flats', () => {
    expect(names(getScale(noteFromLetter('B', '♭'), 'major').notes)).toEqual(['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A']);
  });

  it('E♭ major uses correct letter names', () => {
    expect(names(getScale(noteFromLetter('E', '♭'), 'major').notes)).toEqual(['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D']);
  });

  it('B major uses sharps with correct letters', () => {
    expect(names(getScale(noteFromLetter('B'), 'major').notes)).toEqual(['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯']);
  });
});

describe('Natural minor scales', () => {
  it('A minor has no accidentals', () => {
    expect(names(getScale(noteFromLetter('A'), 'minor').notes)).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
  });

  it('E minor has F♯', () => {
    expect(names(getScale(noteFromLetter('E'), 'minor').notes)).toEqual(['E', 'F♯', 'G', 'A', 'B', 'C', 'D']);
  });

  it('D minor has B♭', () => {
    expect(names(getScale(noteFromLetter('D'), 'minor').notes)).toEqual(['D', 'E', 'F', 'G', 'A', 'B♭', 'C']);
  });

  it('C minor uses correct flats', () => {
    expect(names(getScale(noteFromLetter('C'), 'minor').notes)).toEqual(['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭']);
  });
});

describe('Melodic minor scales', () => {
  it('A melodic minor raises the 6th and 7th', () => {
    expect(names(getScale(noteFromLetter('A'), 'melodicMinor').notes)).toEqual([
      'A',
      'B',
      'C',
      'D',
      'E',
      'F♯',
      'G♯',
    ]);
  });

  it('C melodic minor has E♭, A and B', () => {
    expect(names(getScale(noteFromLetter('C'), 'melodicMinor').notes)).toEqual([
      'C',
      'D',
      'E♭',
      'F',
      'G',
      'A',
      'B',
    ]);
  });

  it('F melodic minor cancels two flats from the natural minor', () => {
    expect(names(getScale(noteFromLetter('F'), 'melodicMinor').notes)).toEqual([
      'F',
      'G',
      'A♭',
      'B♭',
      'C',
      'D',
      'E',
    ]);
  });

  it('G♯ melodic minor needs a double sharp', () => {
    expect(names(getScale(noteFromLetter('G', '♯'), 'melodicMinor').notes)).toEqual([
      'G♯',
      'A♯',
      'B',
      'C♯',
      'D♯',
      'E♯',
      'F𝄪',
    ]);
  });
});

describe('Key signatures', () => {
  it('C major: no sharps or flats', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('C'), 'major'))).toBe('No sharps or flats');
  });

  it('G major: F♯', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('G'), 'major'))).toBe('F♯');
  });

  it('D major: F♯ C♯', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('D'), 'major'))).toBe('F♯ C♯');
  });

  it('B♭ major: B♭ E♭', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('B', '♭'), 'major'))).toBe('B♭ E♭');
  });

  it('E♭ major: B♭ E♭ A♭', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('E', '♭'), 'major'))).toBe('B♭ E♭ A♭');
  });

  it('A minor: no sharps or flats', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('A'), 'minor'))).toBe('No sharps or flats');
  });

  it('E minor: F♯', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('E'), 'minor'))).toBe('F♯');
  });

  it('D minor: B♭', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('D'), 'minor'))).toBe('B♭');
  });

  it('melodic minor uses the natural minor signature', () => {
    expect(keySignatureLabel(getKeySignature(noteFromLetter('A'), 'melodicMinor'))).toBe(
      'No sharps or flats',
    );
    expect(keySignatureLabel(getKeySignature(noteFromLetter('F'), 'melodicMinor'))).toBe(
      'B♭ E♭ A♭ D♭',
    );
    expect(keySignatureLabel(getKeySignature(noteFromLetter('E', '♭'), 'melodicMinor'))).toBe(
      'B♭ E♭ A♭ D♭ G♭ C♭',
    );
  });
});

describe('Diatonic chords', () => {
  it('C major chords', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
    expect(chords.map((c) => c.romanNumeral)).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  });

  it('C major triad notes', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'major');
    expect(names(chords[0].notes)).toEqual(['C', 'E', 'G']);
    expect(names(chords[1].notes)).toEqual(['D', 'F', 'A']);
    expect(names(chords[6].notes)).toEqual(['B', 'D', 'F']);
  });

  it('G major chords', () => {
    const chords = getDiatonicChords(noteFromLetter('G'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F♯dim']);
  });

  it('F major chords use B♭', () => {
    const chords = getDiatonicChords(noteFromLetter('F'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['F', 'Gm', 'Am', 'B♭', 'C', 'Dm', 'Edim']);
  });

  it('C minor chords', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'minor');
    expect(chords.map((c) => c.name)).toEqual(['Cm', 'Ddim', 'E♭', 'Fm', 'Gm', 'A♭', 'B♭']);
    expect(chords.map((c) => c.romanNumeral)).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
  });

  it('C minor triad notes', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'minor');
    expect(names(chords[0].notes)).toEqual(['C', 'E♭', 'G']);
    expect(names(chords[1].notes)).toEqual(['D', 'F', 'A♭']);
    expect(names(chords[2].notes)).toEqual(['E♭', 'G', 'B♭']);
  });

  it('E minor chords', () => {
    const chords = getDiatonicChords(noteFromLetter('E'), 'minor');
    expect(chords.map((c) => c.name)).toEqual(['Em', 'F♯dim', 'G', 'Am', 'Bm', 'C', 'D']);
  });
});

describe('Melodic minor chords', () => {
  it('C melodic minor chords', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'melodicMinor');
    expect(chords.map((c) => c.name)).toEqual(['Cm', 'Dm', 'E♭aug', 'F', 'G', 'Adim', 'Bdim']);
    expect(chords.map((c) => c.romanNumeral)).toEqual(['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°']);
    expect(chords.map((c) => c.quality)).toEqual([
      'minor',
      'minor',
      'augmented',
      'major',
      'major',
      'diminished',
      'diminished',
    ]);
  });

  it('C melodic minor triad notes', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'melodicMinor');
    expect(names(chords[0].notes)).toEqual(['C', 'E♭', 'G']);
    expect(names(chords[2].notes)).toEqual(['E♭', 'G', 'B']);
    expect(names(chords[4].notes)).toEqual(['G', 'B', 'D']);
    expect(names(chords[5].notes)).toEqual(['A', 'C', 'E♭']);
    expect(names(chords[6].notes)).toEqual(['B', 'D', 'F']);
  });

  it('F♯ melodic minor chords', () => {
    const chords = getDiatonicChords(noteFromLetter('F', '♯'), 'melodicMinor');
    expect(chords.map((c) => c.name)).toEqual(['F♯m', 'G♯m', 'Aaug', 'B', 'C♯', 'D♯dim', 'E♯dim']);
    expect(chords.map((c) => c.romanNumeral)).toEqual(['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°']);
    expect(names(chords[2].notes)).toEqual(['A', 'C♯', 'E♯']);
    expect(names(chords[5].notes)).toEqual(['D♯', 'F♯', 'A']);
    expect(names(chords[6].notes)).toEqual(['E♯', 'G♯', 'B']);
  });
});

describe('Every key signature and scale', () => {
  it('spells all 12 major keys with the conventional tonic', () => {
    MAJOR_KEYS.forEach((expected, pc) => {
      const root = getTonic(pc, 'major');
      expect(noteName(root), `pitch class ${pc} major tonic`).toBe(expected.tonic);
      expect(names(getScale(root, 'major').notes), `${expected.tonic} major scale`).toEqual(expected.scale);
      expect(keySignatureLabel(getKeySignature(root, 'major')), `${expected.tonic} major signature`).toBe(
        expected.signature,
      );
    });
  });

  it('spells all 12 natural minor keys with the conventional tonic', () => {
    MINOR_KEYS.forEach((expected, pc) => {
      const root = getTonic(pc, 'minor');
      expect(noteName(root), `pitch class ${pc} minor tonic`).toBe(expected.tonic);
      expect(names(getScale(root, 'minor').notes), `${expected.tonic} minor scale`).toEqual(expected.scale);
      expect(keySignatureLabel(getKeySignature(root, 'minor')), `${expected.tonic} minor signature`).toBe(
        expected.signature,
      );
    });
  });

  it('spells all 12 melodic minor keys with the conventional tonic', () => {
    MELODIC_MINOR_KEYS.forEach((expected, pc) => {
      const root = getTonic(pc, 'melodicMinor');
      expect(noteName(root), `pitch class ${pc} melodic minor tonic`).toBe(expected.tonic);
      expect(names(getScale(root, 'melodicMinor').notes), `${expected.tonic} melodic minor scale`).toEqual(
        expected.scale,
      );
      expect(
        keySignatureLabel(getKeySignature(root, 'melodicMinor')),
        `${expected.tonic} melodic minor signature`,
      ).toBe(expected.signature);
    });
  });

  it('keeps enharmonic keys distinct', () => {
    expect(names(getScale(getTonic(1, 'major'), 'major').notes)).not.toEqual(
      names(getScale(getTonic(3, 'major'), 'major').notes),
    );
    expect(keySignatureLabel(getKeySignature(getTonic(1, 'major'), 'major'))).toBe('B♭ E♭ A♭ D♭ G♭');
    expect(keySignatureLabel(getKeySignature(getTonic(3, 'major'), 'major'))).toBe('B♭ E♭ A♭');
  });

  it('labels the selected spelling first', () => {
    expect(getTonicLabel(1, 'major')).toBe('D♭ / C♯');
    expect(getTonicLabel(1, 'minor')).toBe('C♯ / D♭');
    expect(getTonicLabel(1, 'melodicMinor')).toBe('C♯ / D♭');
    expect(getTonicLabel(3, 'major')).toBe('E♭ / D♯');
    expect(getTonicLabel(3, 'minor')).toBe('E♭ / D♯');
    expect(getTonicLabel(3, 'melodicMinor')).toBe('E♭ / D♯');
    expect(getTonicLabel(0, 'major')).toBe('C');
  });

  it('uses double accidentals when a spelling requires them', () => {
    expect(names(getScale(noteFromLetter('D', '♯'), 'major').notes)).toEqual([
      'D♯',
      'E♯',
      'F𝄪',
      'G♯',
      'A♯',
      'B♯',
      'C𝄪',
    ]);
    expect(keySignatureLabel(getKeySignature(noteFromLetter('D', '♯'), 'major'))).toBe(
      'F𝄪 C𝄪 G♯ D♯ A♯ E♯ B♯',
    );
    // D♯ major is enharmonic with E♭ major, whose signature has only three flats.
    expect(keySignatureLabel(getKeySignature(getTonic(3, 'major'), 'major'))).toBe('B♭ E♭ A♭');
  });
});

describe('Chords in flat and sharp keys', () => {
  it('D♭ major chords', () => {
    const chords = getDiatonicChords(getTonic(1, 'major'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['D♭', 'E♭m', 'Fm', 'G♭', 'A♭', 'B♭m', 'Cdim']);
    expect(names(chords[3].notes)).toEqual(['G♭', 'B♭', 'D♭']);
    expect(names(chords[6].notes)).toEqual(['C', 'E♭', 'G♭']);
  });

  it('E♭ major chords', () => {
    const chords = getDiatonicChords(getTonic(3, 'major'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['E♭', 'Fm', 'Gm', 'A♭', 'B♭', 'Cm', 'Ddim']);
  });

  it('A♭ major chords', () => {
    const chords = getDiatonicChords(getTonic(8, 'major'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['A♭', 'B♭m', 'Cm', 'D♭', 'E♭', 'Fm', 'Gdim']);
  });

  it('B♭ major chords', () => {
    const chords = getDiatonicChords(getTonic(10, 'major'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['B♭', 'Cm', 'Dm', 'E♭', 'F', 'Gm', 'Adim']);
  });

  it('F♯ major chords', () => {
    const chords = getDiatonicChords(getTonic(6, 'major'), 'major');
    expect(chords.map((c) => c.name)).toEqual(['F♯', 'G♯m', 'A♯m', 'B', 'C♯', 'D♯m', 'E♯dim']);
  });

  it('E♭ minor chords', () => {
    const chords = getDiatonicChords(getTonic(3, 'minor'), 'minor');
    expect(chords.map((c) => c.name)).toEqual(['E♭m', 'Fdim', 'G♭', 'A♭m', 'B♭m', 'C♭', 'D♭']);
  });

  it('B♭ minor chords', () => {
    const chords = getDiatonicChords(getTonic(10, 'minor'), 'minor');
    expect(chords.map((c) => c.name)).toEqual(['B♭m', 'Cdim', 'D♭', 'E♭m', 'Fm', 'G♭', 'A♭']);
  });
});

describe('Secondary dominants', () => {
  it('C major secondary dominants', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'major');
    expect(chords.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      'A7',
      'B7',
      'C7',
      'D7',
      'E7',
      null,
    ]);
    expect(chords.map((c) => c.secondaryDominant?.romanNumeral ?? null)).toEqual([
      null,
      'V7/ii',
      'V7/iii',
      'V7/IV',
      'V7/V',
      'V7/vi',
      null,
    ]);
    expect(names(chords[1].secondaryDominant!.notes)).toEqual(['A', 'C♯', 'E', 'G']);
    expect(names(chords[3].secondaryDominant!.notes)).toEqual(['C', 'E', 'G', 'B♭']);
  });

  it('A minor secondary dominants', () => {
    const chords = getDiatonicChords(noteFromLetter('A'), 'minor');
    expect(chords.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      null,
      'G7',
      'A7',
      'B7',
      'C7',
      'D7',
    ]);
    expect(names(chords[4].secondaryDominant!.notes)).toEqual(['B', 'D♯', 'F♯', 'A']);
  });

  it('F♯ major spells double sharps in its secondary dominants', () => {
    const chords = getDiatonicChords(getTonic(6, 'major'), 'major');
    const iii = chords[2].secondaryDominant!;
    expect(iii.name).toBe('E♯7');
    expect(names(iii.notes)).toEqual(['E♯', 'G𝄪', 'B♯', 'D♯']);
    const vi = chords[5].secondaryDominant!;
    expect(vi.name).toBe('A♯7');
    expect(names(vi.notes)).toEqual(['A♯', 'C𝄪', 'E♯', 'G♯']);
  });

  it('E♭ minor and B♭ minor spell flat secondary dominants', () => {
    const eFlatMinor = getDiatonicChords(getTonic(3, 'minor'), 'minor');
    expect(eFlatMinor.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      null,
      'D♭7',
      'E♭7',
      'F7',
      'G♭7',
      'A♭7',
    ]);
    expect(names(eFlatMinor[5].secondaryDominant!.notes)).toEqual(['G♭', 'B♭', 'D♭', 'F♭']);

    const bFlatMinor = getDiatonicChords(getTonic(10, 'minor'), 'minor');
    expect(bFlatMinor.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      null,
      'A♭7',
      'B♭7',
      'C7',
      'D♭7',
      'E♭7',
    ]);
  });

  it('C melodic minor secondary dominants', () => {
    const chords = getDiatonicChords(noteFromLetter('C'), 'melodicMinor');
    expect(chords.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      'A7',
      null,
      'C7',
      'D7',
      null,
      null,
    ]);
    expect(names(chords[1].secondaryDominant!.notes)).toEqual(['A', 'C♯', 'E', 'G']);
    expect(names(chords[3].secondaryDominant!.notes)).toEqual(['C', 'E', 'G', 'B♭']);
    expect(names(chords[4].secondaryDominant!.notes)).toEqual(['D', 'F♯', 'A', 'C']);
  });

  it('B♭ melodic minor secondary dominants', () => {
    const chords = getDiatonicChords(getTonic(10, 'melodicMinor'), 'melodicMinor');
    expect(chords.map((c) => c.secondaryDominant?.name ?? null)).toEqual([
      null,
      'G7',
      null,
      'B♭7',
      'C7',
      null,
      null,
    ]);
    expect(names(chords[1].secondaryDominant!.notes)).toEqual(['G', 'B', 'D', 'F']);
  });

  it('provides a correctly spelled V7 for every tonicizable degree in every key', () => {
    for (const mode of ['major', 'minor', 'melodicMinor'] as const) {
      for (let pc = 0; pc < 12; pc++) {
        const chords = getDiatonicChords(getTonic(pc, mode), mode);
        for (const chord of chords) {
          if (
            chord.degree === 1 ||
            chord.quality === 'diminished' ||
            chord.quality === 'augmented'
          ) {
            expect(chord.secondaryDominant, `${chord.romanNumeral} in ${mode}`).toBeNull();
            continue;
          }
          const dominant = chord.secondaryDominant!;
          expect(dominant, `${chord.romanNumeral} in ${mode}`).not.toBeNull();
          expect(dominant.notes).toHaveLength(4);
          const [root, third, fifth, seventh] = dominant.notes.map(noteToPitchClass);
          expect((third - root + 12) % 12).toBe(4);
          expect((fifth - root + 12) % 12).toBe(7);
          expect((seventh - root + 12) % 12).toBe(10);
        }
      }
    }
  });
});

describe('Progression resolution', () => {
  it('I-V-vi-IV in C major', () => {
    const info = getKeyInfo(noteFromLetter('C'), 'major');
    const prog = PROGRESSIONS.find((p) => p.id === 'maj-1-5-6-4')!;
    expect(resolveProgression(prog, info.chords, info.scale)).toEqual(['C', 'G', 'Am', 'F']);
  });

  it('I-V-vi-IV in G major', () => {
    const info = getKeyInfo(noteFromLetter('G'), 'major');
    const prog = PROGRESSIONS.find((p) => p.id === 'maj-1-5-6-4')!;
    expect(resolveProgression(prog, info.chords, info.scale)).toEqual(['G', 'D', 'Em', 'C']);
  });

  it('ii-V-I in F major', () => {
    const info = getKeyInfo(noteFromLetter('F'), 'major');
    const prog = PROGRESSIONS.find((p) => p.id === 'maj-2-5-1')!;
    expect(resolveProgression(prog, info.chords, info.scale)).toEqual(['Gm', 'C', 'F']);
  });

  it('i-VI-III-VII in C minor', () => {
    const info = getKeyInfo(noteFromLetter('C'), 'minor');
    const prog = PROGRESSIONS.find((p) => p.id === 'min-1-6-3-7')!;
    expect(resolveProgression(prog, info.chords, info.scale)).toEqual(['Cm', 'A♭', 'E♭', 'B♭']);
  });

  it('i-iv-V in A minor', () => {
    const info = getKeyInfo(noteFromLetter('A'), 'minor');
    const prog = PROGRESSIONS.find((p) => p.id === 'min-1-4-5')!;
    expect(resolveProgression(prog, info.chords, info.scale)).toEqual(['Am', 'Dm', 'E']);
  });

  it('i-IV-V and ii-V-i in C melodic minor', () => {
    const info = getKeyInfo(noteFromLetter('C'), 'melodicMinor');
    const oneFourFive = PROGRESSIONS.find((p) => p.id === 'mel-1-4-5')!;
    expect(resolveProgression(oneFourFive, info.chords, info.scale)).toEqual(['Cm', 'F', 'G']);
    const twoFiveOne = PROGRESSIONS.find((p) => p.id === 'mel-2-5-1')!;
    expect(resolveProgression(twoFiveOne, info.chords, info.scale)).toEqual(['Dm', 'G', 'Cm']);
  });
});

describe('Consistency across every key and mode', () => {
  const MODES = ['major', 'minor', 'melodicMinor'] as const;

  function expectedQuality(third: number, fifth: number): string {
    if (third === 4 && fifth === 7) return 'major';
    if (third === 3 && fifth === 7) return 'minor';
    if (third === 3 && fifth === 6) return 'diminished';
    if (third === 4 && fifth === 8) return 'augmented';
    throw new Error(`Unexpected triad intervals: ${third}/${fifth}`);
  }

  it('spells every scale with consecutive letters', () => {
    for (const mode of MODES) {
      for (let pc = 0; pc < 12; pc++) {
        const root = getTonic(pc, mode);
        const scale = getScale(root, mode);
        scale.notes.forEach((note, i) => {
          expect(note.letter, `${noteName(root)} ${mode} degree ${i + 1}`).toBe(
            letterAt(root.letter, i),
          );
        });
      }
    }
  });

  it('names every diatonic triad from its actual intervals', () => {
    for (const mode of MODES) {
      for (let pc = 0; pc < 12; pc++) {
        const root = getTonic(pc, mode);
        for (const chord of getDiatonicChords(root, mode)) {
          const context = `${chord.romanNumeral} in ${noteName(root)} ${mode}`;
          expect(chord.notes, context).toHaveLength(3);
          const [r, t, f] = chord.notes.map(noteToPitchClass);
          const third = (t - r + 12) % 12;
          const fifth = (f - r + 12) % 12;
          expect(chord.quality, context).toBe(expectedQuality(third, fifth));

          // Triads are stacked thirds in the scale.
          const chordRoot = chord.notes[0];
          expect(chord.notes.map((n) => n.letter), context).toEqual([
            chordRoot.letter,
            letterAt(chordRoot.letter, 2),
            letterAt(chordRoot.letter, 4),
          ]);

          // The roman numeral's case and suffix match the actual quality.
          const base = chord.romanNumeral.replace(/[°+]/g, '');
          if (chord.quality === 'major') expect(chord.romanNumeral, context).toBe(base.toUpperCase());
          if (chord.quality === 'minor') expect(chord.romanNumeral, context).toBe(base.toLowerCase());
          if (chord.quality === 'diminished') {
            expect(chord.romanNumeral, context).toBe(`${base.toLowerCase()}°`);
          }
          if (chord.quality === 'augmented') {
            expect(chord.romanNumeral, context).toBe(`${base.toUpperCase()}+`);
          }
        }
      }
    }
  });

  it('spells every secondary dominant as a stacked dominant seventh', () => {
    for (const mode of MODES) {
      for (let pc = 0; pc < 12; pc++) {
        const root = getTonic(pc, mode);
        for (const chord of getDiatonicChords(root, mode)) {
          const dominant = chord.secondaryDominant;
          if (!dominant) continue;
          const context = `${chord.romanNumeral} in ${noteName(root)} ${mode}`;
          expect(dominant.notes, context).toHaveLength(4);

          // The dominant root is a fifth (four letters) above the target.
          const dominantLetter = letterAt(chord.notes[0].letter, 4);
          expect(dominant.notes[0].letter, context).toBe(dominantLetter);
          expect(dominant.notes.map((n) => n.letter), context).toEqual([
            dominantLetter,
            letterAt(dominantLetter, 2),
            letterAt(dominantLetter, 4),
            letterAt(dominantLetter, 6),
          ]);
          expect(dominant.name, context).toBe(`${noteName(dominant.notes[0])}7`);

          const [r, t, f, s] = dominant.notes.map(noteToPitchClass);
          expect((t - r + 12) % 12, context).toBe(4);
          expect((f - r + 12) % 12, context).toBe(7);
          expect((s - r + 12) % 12, context).toBe(10);
        }
      }
    }
  });

  it('resolves every progression in every key to named chords', () => {
    for (const mode of MODES) {
      for (let pc = 0; pc < 12; pc++) {
        const info = getKeyInfo(getTonic(pc, mode), mode);
        for (const def of PROGRESSIONS.filter((p) => p.modes.includes(mode))) {
          const resolved = resolveProgression(def, info.chords, info.scale);
          expect(resolved, `${def.id} in ${noteName(info.root)} ${mode}`).toHaveLength(
            def.numerals.length,
          );
          for (const name of resolved) {
            expect(name, `${def.id} in ${noteName(info.root)} ${mode}`).toMatch(/^[A-G]/);
          }
        }
      }
    }
  });
});
