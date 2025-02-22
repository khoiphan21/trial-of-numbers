import { customAlphabet } from 'nanoid';

const CHARACTERS_IN_UUID = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Collision probability: ~199 million years needed, in order to have a 1%
 * probability of at least one collision.
 *
 * Assuming 1,000,000 IDs generated per second
 *
 * @returns a UUID to identify an entity
 */
export const nanoid = customAlphabet(CHARACTERS_IN_UUID, 30);

/**
 * Collision probability: ~9 hours needed, in order to have a 1% probability of
 * at least one collision.
 *
 * Assuming UIDs are generated 100 per hour (testing usage)
 *
 * This should be for testing only
 *
 * @returns a short (unsafe) UUID to identify an entity during testing
 */
export const shortUuid = customAlphabet('1234567890abcdef', 8);
