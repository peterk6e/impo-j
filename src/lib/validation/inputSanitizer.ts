// src/lib/validation/inputSanitizer.ts
import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (typeof window === 'undefined') {
    // Server-side sanitization
    const { JSDOM } = require('jsdom')
    const window = new JSDOM('').window
    const DOMPurify = require('isomorphic-dompurify')
    return DOMPurify.sanitize(input, { window })
  }
  
  // Client-side sanitization
  return DOMPurify.sanitize(input)
}

/**
 * Sanitize text input (remove HTML tags and dangerous characters)
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .trim()
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9@._-]/g, '') // Keep only valid email characters
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input)
    // Only allow http and https protocols
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString()
    }
    throw new Error('Invalid protocol')
  } catch {
    return ''
  }
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeText(sanitized[key])
    }
  }
  
  return sanitized
}
