import xlsx, {WorkBook} from "xlsx";
import {latinise} from "../utils/latinise";
import {formatDate} from "../utils/formatDate";
import {isDate} from "../utils/isDate";
import {ExcelDTO} from "../dtos/excel";

export const excelService = (
    buffer: Buffer,
    sheetsToIgnore: string[],
    headerLine: number = 0,
    ignoreLastLine: boolean = false
): any => {
    const workbook: WorkBook = xlsx.read(buffer, {
        type: "buffer",
        raw: false,
        cellDates: true
    });

    let records: ExcelDTO[] = [];

    workbook
        .SheetNames
        .filter((s: string) => !sheetsToIgnore.find(sti => sti === s))
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
                        if (isDate(value))
                            rows[indexRow][collumns[indexValue]] = formatDate(value);
                        else
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