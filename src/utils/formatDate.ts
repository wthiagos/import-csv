import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const formatDate = (
    value: string | Date | number | undefined | null
): string | null => {
    if (!value) return null;

    // If it's already a Date or timestamp
    if (value instanceof Date || typeof value === 'number') {
        return dayjs(value).format('DD/MM/YYYY');
    }

    // If it's a string in the format DD/MM/YYYY
    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
            const parsed = dayjs(trimmed, 'DD/MM/YYYY', true);
            return parsed.isValid() ? parsed.format('DD/MM/YYYY') : null;
        }
    }

    return null;
};
