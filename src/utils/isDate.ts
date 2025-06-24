import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const isDate = (value: string | Date | number | undefined | null): boolean => {
    if (value === null || value === undefined) return false;

    if (value instanceof Date) return !isNaN(value.getTime());

    if (typeof value === 'number') return !isNaN(new Date(value).getTime());

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
            return dayjs(trimmed, 'DD/MM/YYYY', true).isValid();
        }
    }

    return false;
};
