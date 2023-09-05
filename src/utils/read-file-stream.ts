import xlsx, {WorkBook} from "xlsx";
import {latinise} from "./latinise";

export const readFileStream = (
    buffer: Buffer,
    sheetsToIgnore: string[],
    headerLine: number = 0,
    ignoreLastLine: boolean = false
): any => {
    const workbook: WorkBook = xlsx.read(buffer, {
        type: "buffer"
    });

    let records: any = {};

    workbook
        .SheetNames
        .filter((s: string) => !sheetsToIgnore.find(sti => sti === s))
        .forEach((s: string) => {
            const options = {
                header: 1,
                skipHidden: true,
            }

            const data: string[][] = xlsx
                .utils
                .sheet_to_json(workbook.Sheets[s], options);

            const collumns: string[] = data[headerLine]
                .map((r: string | null) => {
                    return latinise(r)
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, '_');
                });

            const rows: any[] = []

            data
                .slice(1)
                .forEach((row: string[], indexRow: number) => {
                    if (
                        (data.slice(1).length - 1) === indexRow &&
                        ignoreLastLine
                    )
                        return;

                    rows.push({})

                    row.forEach((value: string | null, indexValue: number) => {
                        rows[indexRow][collumns[indexValue]] = value ?? "";
                    })
                });

            records[s] = {
                name: s,
                records: rows
            };
        });

    return records;
}