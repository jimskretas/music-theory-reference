import { type ProgressionDef } from '@/music/progressions';

export interface ResolvedProgression {
  def: ProgressionDef;
  chords: string[];
}

interface SelectedProgressionsProps {
  progressions: ResolvedProgression[];
}

export function SelectedProgressions({ progressions }: SelectedProgressionsProps) {
  if (progressions.length === 0) return null;

  return (
    <div className="selected-progressions">
      {progressions.map((p) => (
        <div key={p.def.id} className="selected-item">
          <div className="selected-numerals">{p.def.numerals.join(' – ')}</div>
          <div className="selected-chords">{p.chords.join(' – ')}</div>
        </div>
      ))}
    </div>
  );
}
