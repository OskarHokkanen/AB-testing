/**
 * API utility functions for making fetch requests with proper base path handling
 */

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Constructs a full API URL with the base path
 * @param path - The API path (should start with /)
 * @returns The complete URL with base path
 */
export function apiUrl(path: string): string {
  return `${BASE_PATH}${path}`;
}

/**
 * Makes a fetch request with the base path automatically applied
 * @param path - The API path (should start with /)
 * @param options - Fetch options
 * @returns Promise with the fetch response
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), options);
}
