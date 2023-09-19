import xlsx, {WorkBook} from "xlsx";
import {latinise} from "../utils/latinise";

export const csvService = (
    buffer: Buffer,
    headerLine: number = 0,
    ignoreLastLine: boolean = false
): any => {
    const workbook: WorkBook = xlsx.read(buffer, {
        type: "buffer",
        raw: false,
        cellDates: true
    });

    let records: any[] = [];

    workbook
        .SheetNames
        .forEach((s: string) => {
            const options: xlsx.Sheet2JSONOpts = {
                header: 1,
                skipHidden: true,
                raw: false,
            }

            const data: string[][] = xlsx
                .utils
                .sheet_to_json(workbook.Sheets[s], options)

            const collumns: string[] = data[headerLine]
                .map((r: string | null) => {
                    return latinise(r)
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-zA-Z ]/g, '_')
                        .replace(/\s/g, '_')
                        .replace(/__/g, '_')
                        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
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

                    const rowData: any = {};

                    collumns.forEach(c => {
                        rowData[c] = null
                    })

                    rows.push(rowData)

                    row.forEach((value: string | number | Date | null, indexValue: number) => {
                        rows[indexRow][collumns[indexValue]] = value;
                    })
                });

            records.push({
                sheetName: s,
                data: rows
            });
        });

    return records;
}