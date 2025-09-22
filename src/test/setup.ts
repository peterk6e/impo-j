// src/test/setup.ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';  // 👈 use vitest version

// Runs cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.NODE_ENV = 'test';
});
