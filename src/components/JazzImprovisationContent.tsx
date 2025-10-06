'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Music, Book, Headphones, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JazzImprovisationContent() {
  return (
    <div>
      <div className="max-w-6xl mx-auto py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 col-span-2">
            <CardContent className="space-y-6 p-6">
              <Section title="Core Concepts">
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li>
                    <strong>Chord → Scale → Target notes:</strong> Identify chord tones first, use
                    the scale as color.
                  </li>
                  <li>
                    <strong>Voice leading:</strong> Connect 3rds and 7ths between chords smoothly.
                  </li>
                  <li>
                    <strong>Motivic development:</strong> Take a short idea and develop it
                    rhythmically or melodically.
                  </li>
                  <li>
                    <strong>Rhythm & phrasing:</strong> Play with time, rests, and space — not just
                    notes.
                  </li>
                  <li>
                    <strong>Tension & release:</strong> Chromaticism and altered tones resolve to
                    consonance.
                  </li>
                </ul>
              </Section>

              <Section title="Step-by-Step Progression">
                <ol className="list-decimal list-inside space-y-2 text-slate-300">
                  <li>
                    <strong>0–3 months:</strong> Focus on tone, scales, simple ii–V–I patterns, and
                    short transcriptions.
                  </li>
                  <li>
                    <strong>3–9 months:</strong> Guide tones, motifs, melodic minor & altered
                    scales, longer solos.
                  </li>
                  <li>
                    <strong>9–12+ months:</strong> Advanced changes (Coltrane), recording, style
                    development.
                  </li>
                </ol>
              </Section>

              <Section title="Practice Drills">
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  <li>ii–V–I arpeggio & guide-tone lines in all keys.</li>
                  <li>Approach-note drills (chromatic above/below).</li>
                  <li>Motif sequencing and variation exercises.</li>
                  <li>Pentatonic switching over chord changes.</li>
                </ul>
              </Section>

              <Section title="Listening & Transcription">
                <p className="text-slate-300 mb-2">
                  Start small — 4 to 8 bars from a master solo. Learn by ear, sing, play, then
                  analyze.
                </p>
                <ul className="list-disc list-inside text-slate-300">
                  <li>
                    <strong>Miles Davis – Kind of Blue</strong> (Modal simplicity & phrasing)
                  </li>
                  <li>
                    <strong>John Coltrane – Giant Steps</strong> (Complex changes, harmonic mastery)
                  </li>
                  <li>
                    <strong>John Coltrane – A Love Supreme</strong> (Motivic and emotional
                    development)
                  </li>
                </ul>
              </Section>

              <Section title="Resources">
                <ul className="list-disc list-inside text-slate-300">
                  <li>
                    <strong>The Jazz Theory Book</strong> – Mark Levine
                  </li>
                  <li>
                    <strong>The Real Book</strong> – Hal Leonard edition
                  </li>
                  <li>
                    <strong>iReal Pro</strong> & <strong>Jamey Aebersold</strong> play-alongs
                  </li>
                </ul>
              </Section>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardContent className="space-y-4 p-6">
              <Sidebar title="Quick Tips" icon={<Music className="w-5 h-5 text-amber-400" />}>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>Play melodies before you solo.</li>
                  <li>Record every practice — listen back.</li>
                  <li>Leave space; silence is part of rhythm.</li>
                  <li>Transcribe something every week.</li>
                </ul>
              </Sidebar>

              <Sidebar title="Time Goals" icon={<Clock className="w-5 h-5 text-amber-400" />}>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>3 months: Coherent short phrases.</li>
                  <li>6 months: Transpose licks fluently.</li>
                  <li>12 months: Improvise through fast changes.</li>
                </ul>
              </Sidebar>

              <Sidebar title="Study More" icon={<Book className="w-5 h-5 text-amber-400" />}>
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>Analyze solos for target notes & rhythm.</li>
                  <li>Practice slowly (60–80 bpm).</li>
                  <li>Develop your own motifs.</li>
                </ul>
              </Sidebar>

              <Sidebar
                title="Listen Deeply"
                icon={<Headphones className="w-5 h-5 text-amber-400" />}
              >
                <ul className="text-slate-300 text-sm space-y-2">
                  <li>Focus on phrasing & articulation.</li>
                  <li>Notice what the soloist leaves out.</li>
                  <li>Learn to sing solos before playing them.</li>
                </ul>
              </Sidebar>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-semibold text-[var(--secondary)] mb-3">{title}</h2>
      {children}
    </motion.section>
  );
}

function Sidebar({ title, icon, children }: any) {
  return (
    <div className="bg-slate-900/50 rounded-2xl p-4 shadow-inner border border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-slate-200">{title}</h3>
      </div>
      {children}
    </div>
  );
}
