import { ROOT_LABELS } from '@/music/notes';
import { type Mode } from '@/music/scales';

interface KeyControlsProps {
  rootIndex: number;
  mode: Mode;
  onRootChange: (index: number) => void;
  onModeChange: (mode: Mode) => void;
  keySignatureLabel: string;
}

export function KeyControls({ rootIndex, mode, onRootChange, onModeChange, keySignatureLabel }: KeyControlsProps) {
  return (
    <div className="controls">
      <select
        className="select"
        value={rootIndex}
        onChange={(e) => onRootChange(Number(e.target.value))}
        aria-label="Root key"
      >
        {ROOT_LABELS.map((label, i) => (
          <option key={i} value={i}>
            {label}
          </option>
        ))}
      </select>
      <select
        className="select"
        value={mode}
        onChange={(e) => onModeChange(e.target.value as Mode)}
        aria-label="Mode"
      >
        <option value="major">Major</option>
        <option value="minor">Minor</option>
      </select>
      <span className="key-signature-inline" aria-label={`Key signature: ${keySignatureLabel}`}>
        {keySignatureLabel}
      </span>
    </div>
  );
}
