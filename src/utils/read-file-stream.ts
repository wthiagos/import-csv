import xlsx from "xlsx";

export const readFileStream = (buffer: Buffer) => {
    const workbook = xlsx.read(buffer, {type: "buffer"});

    let records: any = {};

    workbook
        .SheetNames
        .forEach(s => {
            records[s] = {
                name: s,
                records: xlsx.utils.sheet_to_json(workbook.Sheets[s])
            };
        });
    
    return records;
}