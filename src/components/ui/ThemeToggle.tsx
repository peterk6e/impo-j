'use client';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="mx-auto text-center ml-4 px-3 py-2 rounded-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
