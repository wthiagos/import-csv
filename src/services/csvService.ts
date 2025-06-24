// services/csvService.ts
import xlsx, { WorkBook } from 'xlsx';
import { latinise } from '../utils/latinise.js';

export interface ParsedSheet {
    sheetName: string;
    data: Record<string, any>[];
}

export interface CsvOptions {
    delimiter?: string;
    headerLine?: number;
    ignoreLastLine?: boolean;
}

export const csvService = (
    buffer: Buffer,
    options: CsvOptions = {}
): ParsedSheet[] => {
    const { delimiter = ';', headerLine = 0, ignoreLastLine = false } = options;

    const workbook: WorkBook = xlsx.read(buffer, {
        type: 'buffer',
        raw: false,
        cellDates: true,
    });

    const records: ParsedSheet[] = [];

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];

        const data: any[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            skipHidden: true,
            raw: false,
        });

        const headerRow = data[headerLine];
        if (!headerRow || !Array.isArray(headerRow)) continue;

        const columns = headerRow.map((cell: string | null) => {
            return latinise(cell || '')
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z ]/g, '_')
                .replace(/\s+/g, '_')
                .replace(/__+/g, '_')
                .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        });

        const rows: Record<string, any>[] = [];

        const dataRows = data.slice(headerLine + 1);

        for (let i = 0; i < dataRows.length; i++) {
            if (ignoreLastLine && i === dataRows.length - 1) break;

            const row = dataRows[i];
            const rowData: Record<string, any> = {};

            columns.forEach((col, idx) => {
                rowData[col] = row?.[idx] ?? null;
            });

            rows.push(rowData);
        }

        records.push({
            sheetName,
            data: rows,
        });
    }

    return records;
};
