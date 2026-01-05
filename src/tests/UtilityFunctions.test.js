import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    capitalize,
    removeNulls,
    convertStringsToOptions,
    convertYearTypetoView,
    plotPointTitle,
    generateNonce,
} from '@/utilities/UtilityFunctions';

describe('UtilityFunctions', () => {
    describe('capitalize', () => {
        it('capitalizes the first letter of a word', () => {
            expect(capitalize('hello')).toBe('Hello');
            expect(capitalize('world')).toBe('World');
        });

        it('handles already capitalized words', () => {
            expect(capitalize('Hello')).toBe('Hello');
            expect(capitalize('WORLD')).toBe('WORLD');
        });

        it('handles single character strings', () => {
            expect(capitalize('a')).toBe('A');
            expect(capitalize('A')).toBe('A');
        });

        it('handles empty string', () => {
            expect(capitalize('')).toBe('');
        });

        it('handles strings with numbers', () => {
            expect(capitalize('123abc')).toBe('123abc');
            expect(capitalize('abc123')).toBe('Abc123');
        });

        it('handles strings with special characters', () => {
            expect(capitalize('hello-world')).toBe('Hello-world');
            expect(capitalize('@hello')).toBe('@hello');
        });

        it('handles unicode characters', () => {
            expect(capitalize('ñame')).toBe('Ñame');
            expect(capitalize('über')).toBe('Über');
        });
    });

    describe('removeNulls', () => {
        it('removes null values from array', () => {
            expect(removeNulls(['a', null, 'b', null, 'c'])).toEqual(['a', 'b', 'c']);
        });

        it('removes undefined values from array', () => {
            expect(removeNulls(['a', undefined, 'b', undefined, 'c'])).toEqual(['a', 'b', 'c']);
        });

        it('removes empty strings from array', () => {
            expect(removeNulls(['a', '', 'b', '', 'c'])).toEqual(['a', 'b', 'c']);
        });

        it('removes zero from array', () => {
            expect(removeNulls(['a', 0, 'b'])).toEqual(['a', 'b']);
        });

        it('removes false from array', () => {
            expect(removeNulls(['a', false, 'b'])).toEqual(['a', 'b']);
        });

        it('handles array with all falsy values', () => {
            expect(removeNulls([null, undefined, '', 0, false])).toEqual([]);
        });

        it('handles empty array', () => {
            expect(removeNulls([])).toEqual([]);
        });

        it('keeps truthy values', () => {
            expect(removeNulls(['a', 1, true, 'b'])).toEqual(['a', 1, true, 'b']);
        });

        it('handles mixed falsy values', () => {
            expect(removeNulls(['a', null, 'b', undefined, 'c', '', 'd', 0, 'e', false])).toEqual(['a', 'b', 'c', 'd', 'e']);
        });
    });

    describe('convertStringsToOptions', () => {
        it('converts array of strings to options format', () => {
            const result = convertStringsToOptions(['latin', 'greek', 'coptic']);
            expect(result).toEqual([
                { title: 'Latin', value: 'latin' },
                { title: 'Greek', value: 'greek' },
                { title: 'Coptic', value: 'coptic' },
            ]);
        });

        it('removes null values before converting', () => {
            const result = convertStringsToOptions(['latin', null, 'greek', undefined, 'coptic']);
            expect(result).toEqual([
                { title: 'Latin', value: 'latin' },
                { title: 'Greek', value: 'greek' },
                { title: 'Coptic', value: 'coptic' },
            ]);
        });

        it('removes empty strings before converting', () => {
            const result = convertStringsToOptions(['latin', '', 'greek', '']);
            expect(result).toEqual([
                { title: 'Latin', value: 'latin' },
                { title: 'Greek', value: 'greek' },
            ]);
        });

        it('handles empty array', () => {
            expect(convertStringsToOptions([])).toEqual([]);
        });

        it('handles array with only falsy values', () => {
            expect(convertStringsToOptions([null, undefined, '', 0, false])).toEqual([]);
        });

        it('capitalizes titles correctly', () => {
            const result = convertStringsToOptions(['hello', 'WORLD', 'test']);
            expect(result).toEqual([
                { title: 'Hello', value: 'hello' },
                { title: 'WORLD', value: 'WORLD' },
                { title: 'Test', value: 'test' },
            ]);
        });

        it('preserves original value while capitalizing title', () => {
            const result = convertStringsToOptions(['lowercase', 'UPPERCASE', 'MixedCase']);
            expect(result[0].value).toBe('lowercase');
            expect(result[0].title).toBe('Lowercase');
            expect(result[1].value).toBe('UPPERCASE');
            expect(result[1].title).toBe('UPPERCASE');
            expect(result[2].value).toBe('MixedCase');
            expect(result[2].title).toBe('MixedCase');
        });

        it('handles single string array', () => {
            const result = convertStringsToOptions(['single']);
            expect(result).toEqual([{ title: 'Single', value: 'single' }]);
        });
    });

    describe('convertYearTypetoView', () => {
        it('converts year type to view format', () => {
            expect(convertYearTypetoView('created')).toBe('Created year');
            expect(convertYearTypetoView('discovered')).toBe('Discovered year');
        });

        it('capitalizes the first letter', () => {
            expect(convertYearTypetoView('created')).toBe('Created year');
            expect(convertYearTypetoView('CREATED')).toBe('CREATED year');
        });

        it('handles empty string', () => {
            expect(convertYearTypetoView('')).toBe(' year');
        });

        it('handles single character', () => {
            expect(convertYearTypetoView('a')).toBe('A year');
        });

        it('handles mixed case', () => {
            expect(convertYearTypetoView('cReAtEd')).toBe('CReAtEd year');
        });
    });

    describe('plotPointTitle', () => {
        it('creates title with required created_year_start', () => {
            const point = { created_year_start: 100 };
            const result = plotPointTitle(point);
            expect(result).toBe('Created from: 100');
        });

        it('includes created_year_end when present', () => {
            const point = {
                created_year_start: 100,
                created_year_end: 150,
            };
            const result = plotPointTitle(point);
            expect(result).toBe('Created from: 100-150');
        });

        it('includes script when present', () => {
            const point = {
                created_year_start: 100,
                script: 'latin',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Script: latin');
        });

        it('includes text when present', () => {
            const point = {
                created_year_start: 100,
                text: 'ROTAS',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Text: ROTAS');
        });

        it('includes place when present', () => {
            const point = {
                created_year_start: 100,
                place: 'Rome',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Place: Rome');
        });

        it('includes location when present', () => {
            const point = {
                created_year_start: 100,
                location: 'Italy',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Location: Italy');
        });

        it('includes discovered_year when present', () => {
            const point = {
                created_year_start: 100,
                discovered_year: 200,
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Year Discovered: 200');
        });

        it('includes shelfmark when present', () => {
            const point = {
                created_year_start: 100,
                shelfmark: 'MS.123',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100');
            expect(result).toContain('\n\n Shelfmark: MS.123');
        });

        it('includes all fields when all are present', () => {
            const point = {
                created_year_start: 100,
                created_year_end: 150,
                script: 'latin',
                text: 'ROTAS',
                place: 'Rome',
                location: 'Italy',
                discovered_year: 200,
                shelfmark: 'MS.123',
            };
            const result = plotPointTitle(point);
            expect(result).toBe(
                'Created from: 100-150\n\n Script: latin\n\n Text: ROTAS\n\n Place: Rome\n\n Location: Italy\n\n Year Discovered: 200\n\n Shelfmark: MS.123'
            );
        });

        it('excludes optional fields when they are falsy', () => {
            const point = {
                created_year_start: 100,
                created_year_end: null,
                script: '',
                text: undefined,
                place: null,
                location: undefined,
                discovered_year: null,
                shelfmark: '',
            };
            const result = plotPointTitle(point);
            expect(result).toBe('Created from: 100');
        });

        it('excludes optional fields when they are 0', () => {
            const point = {
                created_year_start: 100,
                created_year_end: 0,
                discovered_year: 0,
            };
            const result = plotPointTitle(point);
            // created_year_end: 0 is falsy, so it won't be included
            expect(result).toBe('Created from: 100');
        });

        it('handles point with only created_year_start', () => {
            const point = { created_year_start: 0 };
            const result = plotPointTitle(point);
            expect(result).toBe('Created from: 0');
        });

        it('handles string values for years', () => {
            const point = {
                created_year_start: '100',
                created_year_end: '150',
                discovered_year: '200',
            };
            const result = plotPointTitle(point);
            expect(result).toContain('Created from: 100-150');
            expect(result).toContain('\n\n Year Discovered: 200');
        });
    });

    describe('generateNonce', () => {
        // Mock crypto for consistent testing
        beforeEach(() => {
            // Reset any mocks
            vi.clearAllMocks();
        });

        it('returns an array with two elements', async () => {
            const result = await generateNonce();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });

        it('returns nonce and hashed nonce', async () => {
            const [nonce, hashedNonce] = await generateNonce();
            expect(typeof nonce).toBe('string');
            expect(typeof hashedNonce).toBe('string');
            expect(nonce.length).toBeGreaterThan(0);
            expect(hashedNonce.length).toBeGreaterThan(0);
        });

        it('returns different values on each call', async () => {
            const [nonce1, hashedNonce1] = await generateNonce();
            const [nonce2, hashedNonce2] = await generateNonce();
            // Very unlikely to be the same due to randomness
            expect(nonce1).not.toBe(nonce2);
            expect(hashedNonce1).not.toBe(hashedNonce2);
        });

        it('hashed nonce is a hex string', async () => {
            const [, hashedNonce] = await generateNonce();
            // SHA-256 produces 64 hex characters
            expect(hashedNonce).toMatch(/^[0-9a-f]{64}$/);
        });

        it('nonce is base64 encoded', async () => {
            const [nonce] = await generateNonce();
            // Base64 strings contain A-Z, a-z, 0-9, +, /, and = for padding
            expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
        });

        it('returns a promise', () => {
            const result = generateNonce();
            expect(result).toBeInstanceOf(Promise);
        });

        it('handles multiple concurrent calls', async () => {
            const promises = Array.from({ length: 5 }, () => generateNonce());
            const results = await Promise.all(promises);
            
            expect(results.length).toBe(5);
            results.forEach(([nonce, hashedNonce]) => {
                expect(typeof nonce).toBe('string');
                expect(typeof hashedNonce).toBe('string');
                expect(hashedNonce).toMatch(/^[0-9a-f]{64}$/);
            });
        });
    });
});

