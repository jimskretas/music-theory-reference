import { type Mode } from './scales';

export interface ProgressionDef {
  id: string;
  numerals: string[];
  modes: Mode[];
}

export const PROGRESSIONS: readonly ProgressionDef[] = [
  { id: 'maj-1-5-6-4', numerals: ['I', 'V', 'vi', 'IV'], modes: ['major'] },
  { id: 'maj-1-6-4-5', numerals: ['I', 'vi', 'IV', 'V'], modes: ['major'] },
  { id: 'maj-6-4-1-5', numerals: ['vi', 'IV', 'I', 'V'], modes: ['major'] },
  { id: 'maj-1-4-5', numerals: ['I', 'IV', 'V'], modes: ['major'] },
  { id: 'maj-1-5-4', numerals: ['I', 'V', 'IV'], modes: ['major'] },
  { id: 'maj-1-4-6-5', numerals: ['I', 'IV', 'vi', 'V'], modes: ['major'] },
  { id: 'maj-6-5-4-5', numerals: ['vi', 'V', 'IV', 'V'], modes: ['major'] },
  { id: 'maj-2-5-1', numerals: ['ii', 'V', 'I'], modes: ['major'] },
  { id: 'maj-1-6-2-5', numerals: ['I', 'vi', 'ii', 'V'], modes: ['major'] },
  { id: 'maj-1-3-4-5', numerals: ['I', 'iii', 'IV', 'V'], modes: ['major'] },
  { id: 'min-1-6-3-7', numerals: ['i', 'VI', 'III', 'VII'], modes: ['minor'] },
  { id: 'min-1-7-6-7', numerals: ['i', 'VII', 'VI', 'VII'], modes: ['minor'] },
  { id: 'min-1-6-7', numerals: ['i', 'VI', 'VII'], modes: ['minor'] },
  { id: 'min-1-4-5', numerals: ['i', 'iv', 'V'], modes: ['minor'] },
];

export function progressionsForMode(mode: Mode): ProgressionDef[] {
  return PROGRESSIONS.filter((p) => p.modes.includes(mode));
}
