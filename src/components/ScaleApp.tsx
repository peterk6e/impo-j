// components/ScaleApp.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { getScaleData, getChord, ScaleData } from '@/lib/musicTheory';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MODES = ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'];
const SCALES = [
  'ionian (major)',
  'dorian',
  'phrygian',
  'lydian',
  'mixolydian',
  'aeolian (natural minor)',
  'locrian',
  'harmonic minor',
  'melodic minor',
  'pentatonic major',
  'pentatonic minor',
  'blues',
  'whole tone',
  'chromatic',
];

function ScaleSelector({
  keyNote,
  scale,
  setKey,
  setScale,
}: {
  keyNote: string;
  scale: string;
  setKey: (key: string) => void;
  setScale: (scale: string) => void;
}) {
  return (
    <div className="flex gap-8 items-center">
      {/* Key Selector */}
      <div>
        <label className="block text-sm font-medium mb-1 ">Tonalité</label>
        <Select.Root value={keyNote} onValueChange={setKey}>
          <Select.Trigger className="bg-custom  inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm w-32">
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="h-4 w-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-custom rounded-md border shadow-lg">
              <Select.ScrollUpButton className="flex items-center justify-center h-6">
                <ChevronUp className="h-4 w-4" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {NOTES.map((note) => (
                  <Select.Item
                    key={note}
                    value={note}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-cyan-100 hover:text-cyan-800"
                  >
                    <Select.ItemText>{note}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex items-center justify-center h-6">
                <ChevronDown className="h-4 w-4" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Scale Selector */}
      <div>
        <label className="block text-sm font-medium mb-1">Gamme</label>
        <Select.Root value={scale} onValueChange={setScale}>
          <Select.Trigger className=" bg-custom inline-flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm w-48">
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="h-4 w-4" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-custom rounded-md border shadow-lg max-h-60 overflow-y-auto">
              <Select.Viewport className="p-1">
                {SCALES.map((s) => (
                  <Select.Item
                    key={s}
                    value={s}
                    className="cursor-pointer px-3 py-1 rounded hover:bg-blue-100"
                  >
                    <Select.ItemText>{s}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}

export function ScaleSummary({ scaleData }: { scaleData: any }) {
  const [qualityLevel, setQualityLevel] = useState<'seventh' | 'augmented'>('seventh');

  return (
    <div className="space-y-6">
      {/* Scale Info */}
      <details open className="bg-custom p-4 rounded-lg">
        <summary className="cursor-pointer text-xl font-semibold mb-2 select-none">
          🎵 {scaleData.name}
        </summary>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
          <div>
            <span className="font-medium">Notes:</span>
            <p className="text-gray-600">{scaleData.notes.join(' - ')}</p>
          </div>
          <div>
            <span className="font-medium">Key:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="font-bold  rounded bg-blue-100 text-blue-800 text-sm py-1 px-2">
                {scaleData.keySignature}
              </span>
            </div>
          </div>
          <div>
            <span className="font-medium">Characteristics:</span>
            <p className="text-gray-600">{scaleData.characteristics.join(', ')}</p>
          </div>
          <div>
            <span className="font-medium">Blue Notes:</span>
            <p className="text-gray-600">{scaleData.blueNotes?.join(', ') || 'None'}</p>
          </div>
        </div>
      </details>

      {/* Quality Toggle */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Chord Detail Level:</label>
        <select
          className="bg-custom border rounded px-2 py-1 text-sm"
          value={qualityLevel}
          onChange={(e) => setQualityLevel(e.target.value as 'seventh' | 'augmented')}
        >
          <option value="seventh">Seventh chords</option>
          <option value="augmented">Extended chords</option>
        </select>
      </div>

      {/* Scale Degrees */}
      <details open>
        <summary className="cursor-pointer text-lg font-semibold mb-3 select-none">
          Scale Degrees & Chords
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {scaleData.degrees.map((deg: any, i: number) => {
            const quality = scaleData.qualities[qualityLevel][i] || 'maj7';
            const chordLabel = `${deg.note}${quality}`;
            const chordNotes = getChord(deg.note, scaleData.notes, i, quality);

            return (
              <div
                key={i}
                className="bg-custom border p-4 rounded-lg opacity-90 shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm">{deg.label}°</span>
                  <span className="text-blue-600 font-mono text-sm">{deg.roman}</span>
                </div>
                <div className="font-bold text-lg mb-1">{chordLabel}</div>
                <div className="text-sm text-gray-600 mb-2">{deg.interval}</div>
                <div className="text-xs text-gray-500">
                  {chordNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className={idx >= 4 ? 'text-green-500' : ''} // idx >= 4 highlights extensions (9, 11, 13)
                    >
                      {note}
                      {idx < chordNotes.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                  <div className="text-xs text-gray-400">
                    extensions:{' '}
                    {deg.extensions.map((ext: any, idx: any) => (
                      <span key={idx} className="text-jazz-500">
                        {ext}
                        {idx < deg.extensions.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </details>

      {/* Chord Progressions */}
      {scaleData.chordProgressions?.length > 0 && (
        <details>
          <summary className="opacity-90 cursor-pointer text-lg font-semibold mb-3 select-none">
            Common Chord Progressions
          </summary>
          <div className="space-y-2 mt-3">
            {scaleData.chordProgressions.map((progression: string[], i: number) => (
              <div key={i} className="flex gap-2 flex-wrap">
                {progression.map((chord, j) => (
                  <span
                    key={j}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {chord}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Related Scales */}
      {scaleData.relatedScales?.length > 0 && (
        <details>
          <summary className="opacity-90 cursor-pointer text-lg font-semibold mb-3 select-none">
            Related Scales
          </summary>
          <div className="flex gap-2 flex-wrap mt-3">
            {scaleData.relatedScales.map((scale: string, i: number) => (
              <span
                key={i}
                className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
              >
                {scale}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function PianoKeyboard({ highlightedNotes }: { highlightedNotes: string[] }) {
  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackKeyPositions: Record<string, number> = {
    'C#': 0,
    'D#': 1,
    'F#': 3,
    'G#': 4,
    'A#': 5,
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Piano Keyboard</h3>
      <div className="flex justify-center">
        <div className="relative">
          {/* White keys */}
          <div className="flex">
            {whiteKeys.map((note) => (
              <div
                key={note}
                className={`w-12 h-32 border border-gray-300 flex flex-col justify-end items-center p-2 ${
                  highlightedNotes.includes(note)
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 hover:bg-gray-50'
                } transition-colors cursor-pointer`}
              >
                <div className="text-xs font-medium">{note}</div>
              </div>
            ))}
          </div>

          {/* Black keys */}
          <div className="absolute top-0 left-0 h-32 w-full pointer-events-none">
            {Object.entries(blackKeyPositions).map(([note, index]) => (
              <div
                key={note}
                className={`absolute z-10 w-8 h-20 ${
                  highlightedNotes.includes(note)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                } transition-colors rounded-b text-center text-xs pt-16`}
                style={{
                  left: `${index * 48 + 36}px`, // 48px = white key width, 36px = center offset
                  pointerEvents: 'auto',
                }}
              >
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StaffNotation({ scaleData }: { scaleData: ScaleData }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    containerRef.current.innerHTML = '';

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(500, 180);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    const stave = new Stave(10, 40, 480);
    stave.addClef('treble');

    // Si keySignature est au format standard (ex: 'F#', 'Bb'), on l'ajoute
    if (scaleData.keySignature && scaleData.keySignature !== 'C') {
      stave.addKeySignature(scaleData.keySignature);
    }

    stave.setContext(context).draw();

    // Générer les notes sur la portée
    const vexNotes = scaleData.notes.map((note) => {
      const step = note[0].toLowerCase(); // ex: 'c'
      const acc = note.length > 1 ? note.slice(1) : ''; // '', '#', 'b'

      const staveNote = new StaveNote({
        keys: [`${step}/4`],
        duration: 'q',
        clef: 'treble',
        auto_stem: true,
      });

      if (acc) {
        staveNote.addModifier(new Accidental(acc), 0);
      }

      return staveNote;
    });

    const voice = new Voice({
      num_beats: vexNotes.length,
      beat_value: 4,
    }).addTickables(vexNotes);

    new Formatter().joinVoices([voice]).format([voice], 400);

    voice.draw(context, stave);
  }, [scaleData]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Notation musicale</h3>
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="border rounded-lg p-4 bg-gray-50 opacity-90 items-center justify-center flex"
          style={{ width: 550, height: 150 }}
        />
      </div>
    </div>
  );
}

export default function ScaleApp() {
  const [key, setKey] = useState('C');
  const [scale, setScale] = useState('ionian (major)');

  const scaleData = getScaleData(key, scale);
  console.log(scaleData);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <h1 className="text-3xl font-bold">🎶 Scale Explorer</h1>
      <ScaleSelector keyNote={key} scale={scale} setKey={setKey} setScale={setScale} />
      <PianoKeyboard highlightedNotes={scaleData.notes} />
      <ScaleSummary scaleData={scaleData} />
      <StaffNotation scaleData={scaleData} />
    </div>
  );
}
