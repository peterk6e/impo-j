import JazzImprovisationContent from '@/components/JazzImprovisationContent';

export default function JazzPage() {
  return (
    <main className="max-w-6xl mx-auto p-8 min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--secondary)]">
        🎷 Jazz Improvisation: Theory & Practice
      </h1>
      <p className="text-slate-400 p-2">
        A complete roadmap to learning, practicing, and mastering the art of jazz improvisation —
        theory, method, and inspiration from the masters.
      </p>
      <JazzImprovisationContent />
    </main>
  );
}
