import xlsx, { WorkBook, WorkSheet } from "xlsx";
import { latinise } from "./latinise.js";

/**
 * Represents parsed records for a single Excel sheet.
 */
export interface SheetRecords {
    name: string;
    records: Record<string, string>[];
}

/**
 * Reads Excel buffer, parses sheets ignoring specified ones,
 * normalizes headers, and returns data as objects keyed by column names.
 *
 * @param buffer - The Excel file content as a Buffer.
 * @param sheetsToIgnore - Array of sheet names to exclude from parsing.
 * @param headerLine - Zero-based index of the header row (default 0).
 * @param ignoreLastLine - Whether to skip the last line in each sheet (default false).
 * @returns A record mapping sheet names to their parsed SheetRecords.
 * @throws If the buffer is invalid or parsing fails.
 */
export const readFileStream = (
    buffer: Buffer,
    sheetsToIgnore: string[] = [],
    headerLine = 0,
    ignoreLastLine = false
): Record<string, SheetRecords> => {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError("Expected a Buffer for the Excel file.");
    }

    let workbook: WorkBook;

    try {
        workbook = xlsx.read(buffer, { type: "buffer" });
    } catch (error) {
        throw new Error("Failed to read Excel buffer: " + (error as Error).message);
    }

    const sheetNames = workbook.SheetNames.filter(
        (sheet) => !sheetsToIgnore.includes(sheet)
    );

    const records: Record<string, SheetRecords> = {};

    for (const sheetName of sheetNames) {
        const sheet: WorkSheet | undefined = workbook.Sheets[sheetName];
        if (!sheet) {
            // Defensive, unlikely to happen
            records[sheetName] = { name: sheetName, records: [] };
            continue;
        }

        // Parse sheet data as arrays of cells, header:1 means array of arrays
        const data: (string | null)[][] = xlsx.utils.sheet_to_json(sheet, {
            header: 1,
            skipHidden: true,
        });

        // Validate header line exists
        if (!data[headerLine]) {
            records[sheetName] = { name: sheetName, records: [] };
            continue;
        }

        // Normalize header cells into column keys
        const columns = data[headerLine].map((cell) =>
            latinise(cell ?? "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "_")
        );

        // Get all rows after the header line
        const rows = data.slice(headerLine + 1);
        const rowsToProcess = ignoreLastLine ? rows.slice(0, -1) : rows;

        // Map each row array to object keyed by normalized column names
        const parsedRows = rowsToProcess.map((row) =>
            columns.reduce<Record<string, string>>((acc, col, idx) => {
                acc[col] = row[idx] ?? "";
                return acc;
            }, {})
        );

        records[sheetName] = {
            name: sheetName,
            records: parsedRows,
        };
    }

    return records;
};