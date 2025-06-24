import xlsx, { WorkBook } from 'xlsx';
import { latinise } from '../utils/latinise.js';
import { formatDate } from '../utils/formatDate.js';
import { isDate } from '../utils/isDate.js';
import { ExcelDTO } from '../dtos/excel/index.js';

interface ExcelOptions {
    sheetsToIgnore?: string[];
    headerLine?: number;
    ignoreLastLine?: boolean;
}

export const excelService = <T = Record<string, unknown>>(
    buffer: Buffer,
    options: ExcelOptions = {},
    rowMapper?: (row: Record<string, any>) => T
): ExcelDTO<T>[] => {
    const {
        sheetsToIgnore = [],
        headerLine = 0,
        ignoreLastLine = false,
    } = options;

    const workbook: WorkBook = xlsx.read(buffer, {
        type: 'buffer',
        raw: false,
        cellDates: true,
    });

    const records: ExcelDTO<T>[] = [];

    for (const sheetName of workbook.SheetNames) {
        if (sheetsToIgnore.includes(sheetName)) continue;

        const sheet = workbook.Sheets[sheetName];
        const rawData: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            skipHidden: true,
            raw: false,
        });

        const headerRow = rawData[headerLine];
        if (!headerRow || !Array.isArray(headerRow)) continue;

        const columns = headerRow.map((cell: string | null) =>
            latinise(cell || '')
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z ]/g, '_')
                .replace(/\s+/g, '_')
                .replace(/__+/g, '_')
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
        );

        const dataRows = rawData.slice(headerLine + 1);
        const rows: T[] = [];

        for (let i = 0; i < dataRows.length; i++) {
            if (ignoreLastLine && i === dataRows.length - 1) break;

            const row = dataRows[i];
            const rawObject: Record<string, any> = {};

            columns.forEach((col, idx) => {
                const value = row?.[idx];
                rawObject[col] = isDate(value) ? formatDate(value) : value ?? null;
            });

            const typedRow = rowMapper ? rowMapper(rawObject) : (rawObject as T);
            rows.push(typedRow);
        }

        records.push({
            sheetName,
            data: rows,
        });
    }

    return records;
};
