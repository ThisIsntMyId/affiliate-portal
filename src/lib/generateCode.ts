import { customAlphabet } from 'nanoid';

// Define the alphabet for your codes.
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// Create the Nano ID generator once with a default size of 10 for performance.
const nanoid = customAlphabet(alphabet, 10);

/**
 * Generates a unique, URL-friendly 10-character code.
 * @returns {string} A 10-character unique code. e.g., 'k8V2fB7xLp'
 */
export function generateCode(): string {
  return nanoid();
}