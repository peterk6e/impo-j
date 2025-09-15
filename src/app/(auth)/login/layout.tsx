import { Geist, Geist_Mono } from 'next/font/google';
import '../../../app/globals.css';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en">
  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <QueryProvider>
      <ThemeProvider>
      <div className="bg-[var(--background-gradient)] text-[var(--foreground)] font-sans min-h-screen grid grid-rows-[auto_1fr_auto] relative overflow-hidden">
      {/* Header / Menu */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-[var(--foreground)]/20 bg-[var(--background-gradient)]/80 backdrop-blur-md relative z-10">
        <h1 className="text-xl font-bold text-[var(--primary)] tracking-wider uppercase">
          Hear it
        </h1>
        <nav className="flex items-center gap-6">
          <ThemeToggle />
        </nav>
      </header>
        
        {children}

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
