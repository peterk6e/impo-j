# 🎵 Music Theory Guide

## Overview
This comprehensive music theory library provides detailed analysis of scales, chords, and harmonic progressions. It's designed for musicians, composers, and music students who want to understand the theoretical foundations of music.

## Features

### 🎼 Scale Analysis
- **14 Different Scale Types**: From major/minor to exotic scales
- **Scale Degrees**: Complete harmonic analysis with chord qualities
- **Intervals**: Detailed interval analysis for each scale degree
- **Key Signatures**: Automatic key signature detection
- **Blue Notes**: Jazz and blues scale characteristics

### 🎹 Interactive Piano
- **Visual Keyboard**: Highlighted scale notes on piano
- **Black/White Keys**: Proper piano layout with sharps/flats
- **Hover Effects**: Interactive piano experience

### 📝 Staff Notation
- **VexFlow Integration**: Professional music notation rendering
- **Key Signatures**: Proper key signature display
- **Note Positioning**: Accurate note placement on staff

### 🎵 Harmonic Analysis
- **Chord Progressions**: Common progressions for each scale
- **Roman Numerals**: Classical harmonic analysis
- **Chord Qualities**: Major, minor, dominant, diminished, etc.
- **Related Scales**: Modal relationships and substitutions

## Supported Scales

### Major Modes
1. **Ionian (Major)** - Bright, happy, stable
2. **Dorian** - Mysterious, jazz, blues
3. **Phrygian** - Dark, Spanish, exotic
4. **Lydian** - Dreamy, floating, ethereal
5. **Mixolydian** - Bluesy, rock, country
6. **Aeolian (Natural Minor)** - Sad, melancholic
7. **Locrian** - Unstable, experimental

### Minor Scales
8. **Harmonic Minor** - Exotic, dramatic, romantic
9. **Melodic Minor** - Jazz, sophisticated, smooth

### Pentatonic Scales
10. **Pentatonic Major** - Simple, folk, universal
11. **Pentatonic Minor** - Blues, rock, universal

### Special Scales
12. **Blues** - Expressive, soulful, blue notes
13. **Whole Tone** - Floating, dreamy, modern
14. **Chromatic** - Dissonant, atonal, experimental

## Usage Examples

### Basic Scale Analysis
```typescript
import { getScaleData } from '@/lib/musicTheory'

// Get C major scale
const cMajor = getScaleData('C', 'ionian (major)')
console.log(cMajor.notes) // ['C', 'D', 'E', 'F', 'G', 'A', 'B']
console.log(cMajor.degrees[0].chord) // 'Cmaj7'
console.log(cMajor.characteristics) // ['Bright', 'Happy', 'Stable', ...]
```

### Jazz Scale Analysis
```typescript
// Get D dorian scale (common in jazz)
const dDorian = getScaleData('D', 'dorian')
console.log(dDorian.blueNotes) // ['Eb', 'F#', 'Bb']
console.log(dDorian.chordProgressions) // [['i', 'IV', 'i', 'v'], ...]
```

### Blues Scale Analysis
```typescript
// Get A blues scale
const aBlues = getScaleData('A', 'blues')
console.log(aBlues.blueNotes) // ['Eb', 'F#', 'Bb']
console.log(aBlues.chordProgressions) // [['I7', 'I7', 'I7', 'I7'], ...]
```

## Technical Implementation

### Scale Patterns
Scales are defined by semitone patterns from the root note:
- **Major**: [2, 2, 1, 2, 2, 2, 1]
- **Dorian**: [2, 1, 2, 2, 2, 1, 2]
- **Blues**: [3, 2, 1, 1, 3, 2]

### Chord Analysis
Each scale degree gets a chord quality:
- **Ionian**: maj7, m7, m7, maj7, 7, m7, m7b5
- **Dorian**: m7, m7, maj7, 7, m7, m7b5, maj7
- **Blues**: 7, 7, 7, 7, 7, 7

### Blue Notes
Blue notes are characteristic of jazz and blues:
- **Blues Scale**: Eb, F#, Bb
- **Pentatonic Minor**: Eb, F#, Bb
- **Dorian**: Eb, F#, Bb

## Musical Theory Concepts

### Scale Degrees
1. **Root (1st)** - Tonic, most stable
2. **Supertonic (2nd)** - Above tonic
3. **Mediant (3rd)** - Middle of triad
4. **Subdominant (4th)** - Below dominant
5. **Dominant (5th)** - Most important after tonic
6. **Submediant (6th)** - Below tonic
7. **Leading Tone (7th)** - Leads to tonic

### Chord Qualities
- **maj7** - Major 7th chord
- **m7** - Minor 7th chord
- **7** - Dominant 7th chord
- **m7b5** - Half-diminished chord
- **dim7** - Diminished 7th chord

### Roman Numerals
- **Uppercase** - Major chords (I, IV, V)
- **Lowercase** - Minor chords (i, iv, v)
- **°** - Diminished chords (vii°)
- **+** - Augmented chords (III+)

## Advanced Features

### Transposition
```typescript
import { transposeScale } from '@/lib/musicTheory'

const cMajor = getScaleData('C', 'ionian (major)')
const dMajor = transposeScale(cMajor, 2) // Transpose up 2 semitones
```

### Scale Relationships
```typescript
const cMajor = getScaleData('C', 'ionian (major)')
console.log(cMajor.relatedScales) // ['dorian', 'phrygian', 'lydian', ...]
```

### Chord Progressions
```typescript
const cMajor = getScaleData('C', 'ionian (major)')
console.log(cMajor.chordProgressions) // [['I', 'V', 'vi', 'IV'], ...]
```

## Educational Value

This library is perfect for:
- **Music Students** - Understanding scale theory
- **Composers** - Exploring harmonic possibilities
- **Jazz Musicians** - Modal and blues analysis
- **Guitarists** - Scale patterns and chord progressions
- **Pianists** - Visual scale representation

## Future Enhancements

- **Chord Inversions** - Bass note analysis
- **Voice Leading** - Smooth chord progressions
- **Modulation** - Key change analysis
- **Rhythm Patterns** - Time signature analysis
- **MIDI Integration** - Play scales and chords
- **Audio Synthesis** - Generate scale sounds

## Contributing

Feel free to contribute by:
- Adding new scale types
- Improving chord analysis
- Enhancing visual representations
- Adding audio features
- Improving documentation

---

*This music theory library is designed to be both educational and practical, providing musicians with the tools they need to understand and explore the fascinating world of music theory.*
