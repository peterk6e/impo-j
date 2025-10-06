import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hear the Jazz: A Pocket Tool for Listening and Improvisation',
  description:
    'A pocket tool to explore jazz improvisation, scales, and listening practice. Perfect for students, musicians, and curious listeners.',
  keywords: [
    'jazz',
    'music theory',
    'improvisation',
    'scales',
    'chords',
    'ear training',
    'Miles Davis',
    'Kamasi Washington',
  ],
  openGraph: {
    title: 'Hear the Jazz: A Pocket Tool for Listening and Improvisation',
    description:
      'Learn to hear like a jazz musician. Explore scales, harmony, and improvisation through an interactive pocket guide.',
    url: 'https://yourdomain.com',
    siteName: 'Hear the Jazz',
    images: [
      {
        url: '/og-image.jpg', // replace with your OG image path
        width: 1200,
        height: 630,
        alt: 'Hear the Jazz - Pocket Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hear the Jazz',
    description: 'A pocket tool for learning how to listen, improvise, and understand jazz.',
    images: ['/og-image.jpg'],
    creator: '@yourTwitterHandle',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-12 py-20">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[var(--primary)]">
          Hear it
        </h1>
        <h2 className="mt-4 text-xl sm:text-2xl text-[var(--secondary)]">
          A Pocket Tool for Listening and Improvisation
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
          A pocket tool for anyone who wants to step into the world of{' '}
          <span className="text-[var(--primary)]">jazz improvisation</span>. Whether you’re a{' '}
          <span className="text-[var(--primary)]">student</span>, a{' '}
          <span className="text-[var(--secondary)]">curious listener</span>, or a musician deepening
          your voice, this guide bridges <span className="text-[var(--primary)]">theory</span> with{' '}
          <span className="text-[var(--secondary)]">listening</span>. Learn to hear like a jazz
          musician and improvise with confidence.
        </p>
        <Link
          href="/explore"
          className="mt-10 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--foreground)] font-semibold rounded-full shadow-xl hover:scale-105 transition-transform"
        >
          Start Exploring →
        </Link>
      </section>

      {/* Main Content */}
      <main className="relative z-10 px-6 sm:px-16 py-16 max-w-5xl mx-auto space-y-16">
        <section>
          <h3 className="text-3xl font-semibold text-[var(--primary)] mb-4">Features</h3>
          <ul className="space-y-3">
            <li>🎼 14 scale types with harmonic analysis</li>
            <li>🎹 Interactive piano visualization</li>
            <li>📝 Staff notation with key signatures</li>
            <li>🎵 Jazz-focused chord progressions</li>
          </ul>
        </section>

        <section>
          <h3 className="text-3xl font-semibold text-[var(--secondary)] mb-4">Supported Scales</h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-[var(--primary)]">Major Modes</h4>
              <ul className="list-disc list-inside">
                <li>Ionian (Major)</li>
                <li>Dorian</li>
                <li>Phrygian</li>
                <li>Lydian</li>
                <li>Mixolydian</li>
                <li>Aeolian</li>
                <li>Locrian</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[var(--primary)]">Special Scales</h4>
              <ul className="list-disc list-inside">
                <li>Harmonic Minor</li>
                <li>Melodic Minor</li>
                <li>Pentatonics</li>
                <li>Blues</li>
                <li>Whole Tone</li>
                <li>Chromatic</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
