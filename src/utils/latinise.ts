export const Latinise = {
    latin_map: {
        "Á": "A",
        "É": "E",
        "Í": "I",
        "Ó": "O",
        "Ú": "U",
        "á": "a",
        "é": "e",
        "í": "i",
        "ó": "o",
        "ú": "u",
        "ñ": "n",
        "Ñ": "N",
        "ç": "c",
        "Ç": "C",
    }
};

/**
 * Replace special/accented characters in a string with their ASCII equivalents.
 * Returns empty string if input is nullish.
 */
export const latinise = (value: string | null | undefined): string => {
    if (!value) return '';

    return value.replace(/[^A-Za-z0-9\[\] ]/g, (char) => Latinise.latin_map[char as keyof typeof Latinise.latin_map] ?? char);
};

/**
 * Check if a string is already latinised.
 */
export const isLatin = (value: string): boolean => {
    return value === latinise(value);
};


export function validateLatinMapKeys() {
    for (const key in Latinise.latin_map) {
        if (key.length !== 1) {
            console.warn(`Warning: key "${key}" has length ${key.length} (expected 1)`);
        }
    }
}
