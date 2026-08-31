import { useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { KeyControls } from '@/components/KeyControls';
import { DiatonicChords } from '@/components/DiatonicChords';
import { PopularProgressions } from '@/components/PopularProgressions';
import { SelectedProgressions, type ResolvedProgression } from '@/components/SelectedProgressions';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getKeyInfo, resolveProgression } from '@/music/theory';
import { type Mode } from '@/music/scales';
import { NOTE_NAMES } from '@/music/notes';
import { PROGRESSIONS } from '@/music/progressions';

function App() {
  const [rootIndex, setRootIndex] = usePersistentState('mt_rootIndex', 0);
  const [mode, setMode] = usePersistentState<Mode>('mt_mode', 'major');
  const [diatonicExpanded, setDiatonicExpanded] = usePersistentState('mt_diatonicExpanded', false);
  const [progressionsExpanded, setProgressionsExpanded] = usePersistentState('mt_progressionsExpanded', false);
  const [selectedIds, setSelectedIds] = usePersistentState<string[]>('mt_selectedIds', []);
  const [dark, setDark] = usePersistentState('mt_dark', false);

  const root = NOTE_NAMES[rootIndex];
  const keyInfo = useMemo(() => getKeyInfo(root, mode), [root, mode]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedProgressions: ResolvedProgression[] = useMemo(() => {
    return selectedIds
      .map((id) => PROGRESSIONS.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .filter((p) => p.modes.includes(mode))
      .map((def) => ({
        def,
        chords: resolveProgression(def, keyInfo.chords, keyInfo.scale),
      }));
  }, [selectedIds, keyInfo.chords, mode]);

  return (
    <div className={dark ? 'app app-dark' : 'app'}>
      <button
        className="theme-toggle"
        onClick={() => setDark((v) => !v)}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div className="container">
        <KeyControls
          rootIndex={rootIndex}
          mode={mode}
          onRootChange={setRootIndex}
          onModeChange={setMode}
          keySignatureLabel={keyInfo.keySignatureLabel}
        />

        <DiatonicChords
          chords={keyInfo.chords}
          expanded={diatonicExpanded}
          onToggle={() => setDiatonicExpanded((v) => !v)}
        />

        <SelectedProgressions progressions={selectedProgressions} />

        <PopularProgressions
          mode={mode}
          expanded={progressionsExpanded}
          onToggle={() => setProgressionsExpanded((v) => !v)}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          chords={keyInfo.chords}
          scale={keyInfo.scale}
        />
      </div>
    </div>
  );
}

export default App;
