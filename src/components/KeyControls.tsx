import { type ReactNode } from 'react';
import { ROOT_LABELS } from '@/music/notes';
import { getTonicLabel } from '@/music/keySignatures';
import { type Mode } from '@/music/scales';

interface KeyControlsProps {
  rootIndex: number;
  mode: Mode;
  onRootChange: (index: number) => void;
  onModeChange: (mode: Mode) => void;
  keySignatureLabel: string;
  children?: ReactNode;
}

export function KeyControls({
  rootIndex,
  mode,
  onRootChange,
  onModeChange,
  keySignatureLabel,
  children,
}: KeyControlsProps) {
  return (
    <div className="controls">
      {children}
      <select
        className="select"
        value={rootIndex}
        onChange={(e) => onRootChange(Number(e.target.value))}
        aria-label="Root key"
      >
        {ROOT_LABELS.map((_, i) => (
          <option key={i} value={i}>
            {getTonicLabel(i, mode)}
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
        <option value="melodicMinor">Melodic minor</option>
      </select>
      <span
        className="key-signature-inline"
        aria-label={
          mode === 'melodicMinor'
            ? `Key signature: ${keySignatureLabel}. Melodic minor raises the 6th and 7th with accidentals.`
            : `Key signature: ${keySignatureLabel}`
        }
        title={
          mode === 'melodicMinor'
            ? 'Melodic minor uses the natural minor key signature; its raised 6th and 7th are written as accidentals.'
            : undefined
        }
      >
        {keySignatureLabel}
      </span>
    </div>
  );
}
