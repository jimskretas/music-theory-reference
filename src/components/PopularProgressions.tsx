import { ChevronRight } from 'lucide-react';
import { type ProgressionDef, progressionsForMode } from '@/music/progressions';
import { type DiatonicChord } from '@/music/chords';
import { type Mode } from '@/music/scales';
import { type Note } from '@/music/notes';
import { resolveProgression } from '@/music/theory';
import { type ResolvedProgression } from './SelectedProgressions';

interface PopularProgressionsProps {
  mode: Mode;
  expanded: boolean;
  onToggle: () => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  chords: DiatonicChord[];
  scale: Note[];
}

export function PopularProgressions({
  mode,
  expanded,
  onToggle,
  selectedIds,
  onToggleSelect,
  chords,
  scale,
}: PopularProgressionsProps) {
  const progressions = progressionsForMode(mode);

  return (
    <div className="progressions-section">
      <button
        className="progressions-header"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls="progressions-list"
      >
        <span>Popular progressions</span>
        <ChevronRight
          size={16}
          className={expanded ? 'chevron chevron-open' : 'chevron'}
        />
      </button>
      {expanded && (
        <div id="progressions-list" className="progressions-list">
          {progressions.map((def) => {
            const resolved = resolveProgression(def, chords, scale);
            const checked = selectedIds.includes(def.id);
            return (
              <label key={def.id} className="progression-row">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleSelect(def.id)}
                />
                <span className="prog-numerals">{def.numerals.join(' – ')}</span>
                <span className="prog-chords">{resolved.join(' – ')}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export type { ResolvedProgression };
