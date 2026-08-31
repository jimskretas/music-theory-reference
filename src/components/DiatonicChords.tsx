import { type DiatonicChord } from '@/music/theory';
import { noteName } from '@/music/notes';

interface DiatonicChordsProps {
  chords: DiatonicChord[];
  expanded: boolean;
  onToggle: () => void;
}

export function DiatonicChords({ chords, expanded, onToggle }: DiatonicChordsProps) {
  if (expanded) {
    return (
      <button
        className="diatonic-expanded"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label="Collapse diatonic chords"
      >
        <table className="triad-table">
          <tbody>
            {chords.map((chord) => (
              <tr key={chord.degree}>
                <td className="roman-cell">{chord.romanNumeral}</td>
                <td className="chord-name-cell">{chord.name}</td>
                <td className="notes-cell">{chord.notes.map(noteName).join(' ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </button>
    );
  }

  return (
    <button
      className="diatonic-collapsed"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label="Expand diatonic chords to see triad notes"
    >
      <div className="chord-strip">
        {chords.map((chord) => (
          <div className="chord-cell" key={chord.degree}>
            <span className="chord-name">{chord.name}</span>
            <span className="chord-roman">{chord.romanNumeral}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
