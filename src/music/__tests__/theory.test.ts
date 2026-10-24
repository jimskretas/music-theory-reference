import { describe, it, expect } from 'vitest';
import { getScale } from '@/music/scales';
import { noteName, noteFromLetter, type Note } from '@/music/notes';
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
    expect(getTonicLabel(3, 'major')).toBe('E♭ / D♯');
    expect(getTonicLabel(3, 'minor')).toBe('E♭ / D♯');
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
});
