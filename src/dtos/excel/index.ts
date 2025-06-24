export interface ExcelDTO<T = Record<string, unknown>> {
    sheetName: string;
    data: T[];
}
