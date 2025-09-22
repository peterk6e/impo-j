// src/lib/musicTheory.ts
// Comprehensive music theory library for scale analysis

export interface ScaleDegree {
  label: string;
  chord: string;
  notes: string[];
  interval: string;
  quality: string;
  roman: string;
  note: string;
}

export interface ScaleData {
  name: string;
  notes: string[];
  keySignature: string;
  degrees: ScaleDegree[];
  intervals: string[];
  blueNotes?: string[];
  chordProgressions: string[][];
  characteristics: string[];
  relatedScales: string[];
  extensions?: string[]; // Optional: ["9", "13"], etc.
  qualities: {
    seventh: string[];
    augmented: string[];
  };
}

type ChordQualitiesByLevel = {
  seventh: string[];
  augmented: string[];
};

// Note mapping for enharmonic equivalents
const NOTE_MAP: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

// Scale patterns (semitones from root)
const SCALE_PATTERNS: Record<string, number[]> = {
  'ionian (major)': [2, 2, 1, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  'aeolian (natural minor)': [2, 1, 2, 2, 1, 2, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
  'harmonic minor': [2, 1, 2, 2, 1, 3, 1],
  'melodic minor': [2, 1, 2, 2, 2, 2, 1],
  'pentatonic major': [2, 2, 3, 2, 3],
  'pentatonic minor': [3, 2, 2, 3, 2],
  blues: [3, 2, 1, 1, 3, 2],
  'whole tone': [2, 2, 2, 2, 2, 2],
  chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};

// Chord qualities for each scale degree
const CHORD_QUALITIES: Record<string, ChordQualitiesByLevel & { extensions?: string[][] }> = {
  'ionian (major)': {
    seventh: ['maj7', 'm7', 'm7', 'maj7', '7', 'm7', 'm7b5'],
    augmented: ['maj9', 'm9', 'm9', 'maj11', '9', 'm9', 'm7b5'],
    extensions: [
      ['9', '13'], // I
      ['9', '11', '13'], // ii — possible en jazz
      ['9', '11'], // iii
      ['9', '13'], // IV
      ['9', '13'], // V
      ['9', '11'], // vi
      ['11', 'b13'], // vii° (le b13 peut sonner très tendu)
    ],
  },
  dorian: {
    seventh: ['m7', 'm7', 'maj7', '7', 'm7', 'm7b5', 'maj7'],
    augmented: ['m9', 'm9', 'maj9', '11', 'm9', 'm7b5', 'maj9'],
    extensions: [['9', '11', '13'], ['9', '11', '13'], ['9'], ['9', '13'], ['11'], ['11'], ['13']],
  },
  phrygian: {
    seventh: ['m7', 'maj7', '7', 'm7', 'm7b5', 'maj7', 'm7'],
    augmented: ['m9', 'maj9', '9', '11', 'm7b5', 'maj9', 'm9'],
    extensions: [['9', '11'], ['9'], ['9', '13'], ['11'], ['11'], ['9'], ['9', '11']],
  },
  lydian: {
    seventh: ['maj7', '7', 'm7', 'm7b5', 'maj7', 'm7', 'm7'],
    augmented: ['maj9', '9', 'm9', 'm7b5', 'maj11', 'm9', 'm9'],
    extensions: [
      ['9', '#11', '13'],
      ['9', '13'],
      ['9', '11'],
      ['11'],
      ['9', '#11'],
      ['9', '11'],
      ['9', '11'],
    ],
  },
  mixolydian: {
    seventh: ['7', 'm7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7'],
    augmented: ['9', 'm9', 'm7b5', 'maj9', 'm9', 'm9', 'maj11'],
    extensions: [['9', '13'], ['9', '11'], ['11'], ['9', '13'], ['11'], ['9'], ['13']],
  },
  'aeolian (natural minor)': {
    seventh: ['m7', 'm7b5', 'maj7', 'm7', 'm7', 'maj7', '7'],
    augmented: ['m9', 'm7b5', 'maj9', '11', 'm9', 'maj9', '9'],
    extensions: [['9', '11'], ['11'], ['9'], ['9', '11'], ['9'], ['9', '13'], ['9', '13']],
  },
  locrian: {
    seventh: ['m7b5', 'maj7', 'm7', 'm7', 'maj7', '7', 'm7'],
    augmented: ['m7b5', 'maj9', 'm9', '11', 'maj9', '9', 'm9'],
    extensions: [['11', 'b13'], ['9'], ['9', '11'], ['11'], ['9', '13'], ['9', '13'], ['9', '11']],
  },
  'harmonic minor': {
    seventh: ['m(maj7)', 'm7b5', 'maj7#5', 'm7', '7', 'maj7', 'dim7'],
    augmented: ['m(maj9)', 'm7b5', 'maj7#5', 'm9', '9', 'maj11', 'dim7'],
    extensions: [
      ['9', '11'],
      ['11'],
      ['9', '#11', '13'],
      ['9', '11'],
      ['9', '13'],
      ['9', '#11'],
      ['13'],
    ],
  },
  'melodic minor': {
    seventh: ['m(maj7)', 'm7', 'maj7#5', '7', '7', 'm7b5', 'm7b5'],
    augmented: ['m(maj9)', 'm9', 'maj7#5', '9', '11', 'm7b5', 'm7b5'],
    extensions: [
      ['9', '11', '13'],
      ['9', '11', '13'],
      ['9', '#11'],
      ['9', '13'],
      ['9', '13'],
      ['11'],
      ['11'],
    ],
  },
  'pentatonic major': {
    seventh: ['maj7', 'm7', 'm7', 'maj7', '7'],
    augmented: ['maj9', 'm9', 'm9', 'maj11', '9'],
    extensions: [
      ['9', '13'],
      ['9', '11'],
      ['9', '11'],
      ['9', '13'],
      ['9', '13'],
    ],
  },
  'pentatonic minor': {
    seventh: ['m7', 'm7', 'maj7', '7', 'm7'],
    augmented: ['m9', 'm9', 'maj9', '9', 'm9'],
    extensions: [['9', '11'], ['9', '11'], ['9'], ['9', '13'], ['9', '11']],
  },
  blues: {
    seventh: ['7', '7', '7', '7', '7', '7'],
    augmented: ['13', '13', '13', '13', '13', '13'],
    extensions: [
      ['9', '13'],
      ['9', '13'],
      ['9', '13'],
      ['9', '13'],
      ['9', '13'],
      ['9', '13'],
    ],
  },
  'whole tone': {
    seventh: ['7', '7', '7', '7', '7', '7'],
    augmented: ['13', '13', '13', '13', '13', '13'],
    extensions: [
      ['9', '#11', '13'],
      ['9', '#11', '13'],
      ['9', '#11', '13'],
      ['9', '#11', '13'],
      ['9', '#11', '13'],
      ['9', '#11', '13'],
    ],
  },
  chromatic: {
    seventh: Array(12).fill('dim7'),
    augmented: Array(12).fill('dim7'),
    extensions: Array(12).fill(['b9', '11', 'b13']),
  },
};

// Roman numerals for chord analysis
const ROMAN_NUMERALS: Record<string, string[]> = {
  'ionian (major)': ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  dorian: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
  phrygian: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
  lydian: ['I', 'II', 'iii', 'iv°', 'V', 'vi', 'vii'],
  mixolydian: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
  'aeolian (natural minor)': ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
  locrian: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'],
  'harmonic minor': ['i', 'ii°', 'III+', 'iv', 'V', 'VI', 'vii°'],
  'melodic minor': ['i', 'ii', 'III+', 'IV', 'V', 'vi°', 'vii°'],
  'pentatonic major': ['I', 'ii', 'iii', 'IV', 'V'],
  'pentatonic minor': ['i', 'iii', 'IV', 'v', 'vii'],
  blues: ['I7', 'I7', 'I7', 'I7', 'I7', 'I7'],
  'whole tone': ['I7', 'I7', 'I7', 'I7', 'I7', 'I7'],
  chromatic: ['i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°', 'i°'],
};

// Scale characteristics
const SCALE_CHARACTERISTICS: Record<string, string[]> = {
  'ionian (major)': ['Bright', 'Happy', 'Stable', 'Classical', 'Traditional'],
  dorian: ['Mysterious', 'Jazz', 'Blues', 'Minor with major 6th', 'Modal'],
  phrygian: ['Dark', 'Spanish', 'Flamenco', 'Minor with minor 2nd', 'Exotic'],
  lydian: ['Dreamy', 'Floating', 'Major with augmented 4th', 'Modern', 'Ethereal'],
  mixolydian: ['Bluesy', 'Rock', 'Country', 'Major with minor 7th', 'Dominant'],
  'aeolian (natural minor)': [
    'Sad',
    'Melancholic',
    'Classical minor',
    'Natural minor',
    'Traditional',
  ],
  locrian: ['Unstable', 'Rare', 'Diminished', 'Half-diminished', 'Experimental'],
  'harmonic minor': ['Exotic', 'Classical', 'Minor with major 7th', 'Dramatic', 'Romantic'],
  'melodic minor': ['Jazz', 'Ascending minor', 'Major 6th and 7th', 'Smooth', 'Sophisticated'],
  'pentatonic major': ['Simple', 'Folk', 'Asian', 'No semitones', 'Universal'],
  'pentatonic minor': ['Blues', 'Rock', 'Simple', 'No semitones', 'Universal'],
  blues: ['Blues', 'Jazz', 'Soul', 'Blue notes', 'Expressive'],
  'whole tone': ['Floating', 'Dreamy', 'Debussy', 'Augmented', 'Modern'],
  chromatic: ['Dissonant', 'Modern', 'All notes', 'Atonal', 'Experimental'],
};

// Blue notes for jazz/blues scales
// const BLUE_NOTES: Record<string, string[]> = {
//   blues: ['Eb', 'F#', 'Bb'],
//   'pentatonic minor': ['Eb', 'F#', 'Bb'],
//   dorian: ['Eb', 'F#', 'Bb'],
//   mixolydian: ['Eb', 'F#', 'Bb'],
// };

const BLUE_NOTE_INTERVALS: Record<string, number[]> = {
  blues: [3, 6, 10], // Minor 3rd, flat 5th, minor 7th
  'pentatonic minor': [3, 6, 10],
  dorian: [3, 6, 10], // Optional; debatable
  mixolydian: [3, 6, 10], // Optional
};

// Common chord progressions
const CHORD_PROGRESSIONS: Record<string, string[][]> = {
  'ionian (major)': [
    ['I', 'V', 'vi', 'IV'], // Pop progression
    ['I', 'vi', 'IV', 'V'], // 50s progression
    ['ii', 'V', 'I'], // Jazz progression
    ['I', 'IV', 'V', 'I'], // Classical progression
  ],
  dorian: [
    ['i', 'IV', 'i', 'v'], // Dorian progression
    ['i', 'VII', 'i', 'v'], // Modal progression
    ['i', 'bVII', 'i', 'v'], // Rock progression
  ],
  'aeolian (natural minor)': [
    ['i', 'bVII', 'bVI', 'bVII'], // Minor progression
    ['i', 'iv', 'V', 'i'], // Classical minor
    ['i', 'bIII', 'bVII', 'i'], // Modern minor
  ],
  blues: [
    ['I7', 'I7', 'I7', 'I7'], // 12-bar blues
    ['I7', 'IV7', 'I7', 'I7'], // Blues variation
    ['I7', 'IV7', 'V7', 'I7'], // Full blues
  ],
};

// Related scales
const RELATED_SCALES: Record<string, string[]> = {
  'ionian (major)': [
    'dorian',
    'phrygian',
    'lydian',
    'mixolydian',
    'aeolian (natural minor)',
    'locrian',
  ],
  dorian: ['aeolian (natural minor)', 'phrygian', 'ionian (major)', 'mixolydian'],
  phrygian: ['locrian', 'dorian', 'aeolian (natural minor)'],
  lydian: ['ionian (major)', 'mixolydian'],
  mixolydian: ['dorian', 'ionian (major)', 'lydian'],
  'aeolian (natural minor)': ['dorian', 'phrygian', 'harmonic minor', 'melodic minor'],
  'harmonic minor': ['aeolian (natural minor)', 'melodic minor'],
  'melodic minor': ['aeolian (natural minor)', 'harmonic minor'],
  'pentatonic major': ['pentatonic minor', 'blues'],
  'pentatonic minor': ['pentatonic major', 'blues'],
  blues: ['pentatonic minor', 'pentatonic major'],
};

// Get note index in chromatic scale
function getNoteIndex(note: string): number {
  const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return chromatic.indexOf(note);
}

// Get note at specific interval from root
function getNoteAtInterval(root: string, semitones: number, preferFlats = false): string {
  const sharpChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatChromatic = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const chromatic = preferFlats ? flatChromatic : sharpChromatic;
  const rootIndex = sharpChromatic.indexOf(root);
  if (rootIndex === -1) {
    return root;
  }

  const index = (rootIndex + semitones) % 12;
  return chromatic[index];
}

// Build scale from pattern
function buildScale(root: string, pattern: number[]): string[] {
  const scale = [root];
  let currentNote = root;

  for (const interval of pattern) {
    currentNote = getNoteAtInterval(currentNote, interval);
    scale.push(currentNote);
  }

  // Supprime la dernière note si elle est identique à la tonique
  if (scale[scale.length - 1] === root) {
    scale.pop();
  }

  return scale;
}

// Get chord for scale degree
export function getChord(root: string, scale: string[], degree: number, quality: string): string[] {
  // On récupère la note de la gamme au degré donné
  const note = scale[degree];

  // Récupère les intervalles correspondant à la qualité de l'accord (inclut 11 et 13 si défini)
  const intervals = getChordIntervals(quality);

  // Pour chaque intervalle, calcule la note correspondante à partir de la note root
  return intervals.map((interval) => getNoteAtInterval(note, interval));
}

const EXTENSION_INTERVALS: Record<string, number> = {
  '9': 14,
  b9: 13,
  '#9': 15,
  '11': 17,
  '#11': 18,
  b11: 16,
  '13': 21,
  b13: 20,
  '#13': 22,
};

// Get chord intervals based on quality
function getChordIntervals(quality: string): number[] {
  const intervals: Record<string, number[]> = {
    maj7: [0, 4, 7, 11],
    m7: [0, 3, 7, 10],
    '7': [0, 4, 7, 10],
    m7b5: [0, 3, 6, 10],
    'm(maj7)': [0, 3, 7, 11],
    'maj7#5': [0, 4, 8, 11],
    dim7: [0, 3, 6, 9],
    '7#5': [0, 4, 8, 10],
    'm7#5': [0, 3, 8, 10],

    // Extended chords
    maj9: [0, 4, 7, 11, 14],
    m9: [0, 3, 7, 10, 14],
    '9': [0, 4, 7, 10, 14],
    m11: [0, 3, 7, 10, 14, 17],
    '11': [0, 4, 7, 10, 14, 17],
    m13: [0, 3, 7, 10, 14, 17, 21],
    '13': [0, 4, 7, 10, 14, 17, 21],
  };

  return intervals[quality] || [0, 4, 7, 10]; // Default to dominant 7th
}

// Get interval names
function getIntervalNames(pattern: number[]): string[] {
  const intervalNames = [
    'Root',
    'Minor 2nd',
    'Major 2nd',
    'Minor 3rd',
    'Major 3rd',
    'Perfect 4th',
    'Tritone',
    'Perfect 5th',
    'Minor 6th',
    'Major 6th',
    'Minor 7th',
    'Major 7th',
    'Octave',
  ];

  let currentInterval = 0;
  const names = ['Root']; // Commencer par la tonique

  for (const interval of pattern) {
    currentInterval += interval;
    names.push(intervalNames[currentInterval] || `${currentInterval} semitones`);
  }

  return names;
}
// Get key signature
function getKeySignature(root: string, scale: string): string {
  // VexFlow supports keys like "C", "F#", "Bb", "Eb", etc.
  // So we only return the root, possibly adjusted if needed.

  const supportedKeys = [
    'C',
    'G',
    'D',
    'A',
    'E',
    'B',
    'F#',
    'C#',
    'F',
    'Bb',
    'Eb',
    'Ab',
    'Db',
    'Gb',
    'Cb',
    'Am',
    'Em',
    'Bm',
    'F#m',
    'C#m',
    'G#m',
    'D#m',
    'A#m',
    'Dm',
    'Gm',
    'Cm',
    'Fm',
    'Bbm',
    'Ebm',
    'Abm',
  ];

  // Handle minor keys
  const isMinor = scale.toLowerCase().includes('minor');
  const keyName = isMinor ? `${root}m` : root;

  if (supportedKeys.includes(keyName)) {
    return keyName;
  }

  // Fallback to C major
  return isMinor ? 'Am' : 'C';
}

// Main function to get scale data
export function getScaleData(root: string, scaleName: string): ScaleData {
  const pattern = SCALE_PATTERNS[scaleName] || SCALE_PATTERNS['ionian (major)'];
  const scale = buildScale(root, pattern);

  const allQualities = CHORD_QUALITIES[scaleName] || CHORD_QUALITIES['ionian (major)'];
  const romans = ROMAN_NUMERALS[scaleName] || ROMAN_NUMERALS['ionian (major)'];
  const intervals = getIntervalNames(pattern);

  const degrees: ScaleDegree[] = scale.map((note, index) => {
    const quality = allQualities.seventh[index] || 'maj7';
    const chordNotes = getChord(root, scale, index, quality);

    const degreeExtensions = allQualities.extensions?.[index] || [];
    const extensionIntervals = degreeExtensions
      .map((ext) => EXTENSION_INTERVALS[ext])
      .filter((intv): intv is number => intv !== undefined);
    const extensionNotes = extensionIntervals.map((interval) => getNoteAtInterval(note, interval));

    return {
      label: `${index + 1}`,
      chord: `${note}${quality}`,
      notes: chordNotes,
      interval: intervals[index] || 'Unknown',
      quality,
      roman: romans[index] || 'I',
      note,
      extensions: extensionNotes,
    };
  });

  const blueNoteIntervals = BLUE_NOTE_INTERVALS[scaleName] || [];
  const blueNotes = blueNoteIntervals.map((semitone) => getNoteAtInterval(root, semitone));

  const chordProgressions = CHORD_PROGRESSIONS[scaleName] || [];
  const characteristics = SCALE_CHARACTERISTICS[scaleName] || [];
  const relatedScales = RELATED_SCALES[scaleName] || [];
  const keySignature = getKeySignature(root, scaleName);

  return {
    name: `${root} ${scaleName}`,
    notes: scale,
    keySignature,
    degrees,
    intervals,
    blueNotes,
    chordProgressions,
    characteristics,
    relatedScales,
    qualities: allQualities,
  };
}

// Utility function to get all available scales
export function getAvailableScales(): string[] {
  return Object.keys(SCALE_PATTERNS);
}

// Utility function to get all available notes
export function getAvailableNotes(): string[] {
  return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
}

// Utility function to transpose scale
export function transposeScale(scaleData: ScaleData, semitones: number): ScaleData {
  const newRoot = getNoteAtInterval(scaleData.notes[0], semitones);
  const scaleName = scaleData.name.split(' ').slice(1).join(' ');
  return getScaleData(newRoot, scaleName);
}
