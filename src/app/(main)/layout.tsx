'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../../app/globals.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <div className="bg-[var(--background-gradient)] text-[var(--foreground)] font-sans min-h-screen grid grid-rows-[auto_1fr_auto] relative overflow-hidden">
              {/* Background stars */}
              <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,128,0.05),transparent_60%)]" />
              <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(circle_at_70%_80%,rgba(0,200,200,0.07),transparent_60%)]" />

              {/* Header */}
              <header className="fixed top-0 left-0 w-full transition-all shadow-sm flex items-center justify-between px-6 py-4 border-b border-[var(--foreground)]/20 bg-[var(--background-gradient)]/80 backdrop-blur-md z-50">
                <h1 className="text-lg font-bold text-[var(--primary)] tracking-wider uppercase">
                  Hear it
                </h1>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                  <Link href="/" className="hover:text-[var(--primary)] transition">
                    Home
                  </Link>
                  <Link href="/scale-explorer" className="hover:text-[var(--primary)] transition">
                    Scale Explorer
                  </Link>
                  <Link href="/albums" className="hover:text-[var(--primary)] transition">
                    Albums
                  </Link>
                  <Link href="/theory" className="hover:text-[var(--primary)] transition">
                    Theory
                  </Link>
                  <ThemeToggle />
                  <Link
                    href="/login"
                    className="ml-4 px-5 py-2 bg-[var(--primary)] text-[var(--foreground)] font-medium rounded-full shadow-lg hover:opacity-90 transition"
                  >
                    Login
                  </Link>
                </nav>

                {/* Mobile Burger */}
                <button
                  className="md:hidden p-2 rounded-md text-[var(--foreground)] hover:bg-[var(--foreground)]/10 transition"
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                >
                  {open ? <X size={24} /> : <Menu size={24} />}
                </button>
              </header>

              {/* Mobile Menu Drawer */}
              <div
                className={`fixed inset-0 z-40 bg-blue/80 sm:bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                  open ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={() => setOpen(false)}
              />

              <aside
                className={`fixed top-0 right-0 h-full w-64 bg-[var(--background)] shadow-lg z-50 transform transition-transform duration-300 ${
                  open ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                <nav className="flex flex-col p-6 gap-6">
                  <Link href="/" onClick={() => setOpen(false)}>
                    Home
                  </Link>
                  <Link href="/scale-explorer" onClick={() => setOpen(false)}>
                    Scale Explorer
                  </Link>
                  <Link href="/albums" onClick={() => setOpen(false)}>
                    Albums
                  </Link>
                  <Link href="/theory" onClick={() => setOpen(false)}>
                    Theory
                  </Link>
                  <ThemeToggle />
                  <Link
                    href="/login"
                    className="max-w-24 text-center px-5 py-2 bg-[var(--primary)] text-[var(--foreground)] font-medium rounded-full shadow-lg hover:opacity-90 transition"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                </nav>
              </aside>

              <div className="mt-16">{children}</div>

              {/* Footer */}
              <footer className="relative z-10 text-center text-sm px-6 py-8 border-t border-[var(--foreground)]/20">
                <p>&copy; 2025 Hear the Jazz. Cosmic vibes included.</p>
              </footer>
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
