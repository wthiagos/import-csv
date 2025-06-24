import { Type, Static } from "@sinclair/typebox";

const CsvFile = Type.Object({
    encoding: Type.Optional(Type.String()),
    filename: Type.Optional(Type.String()),
    limit: Type.Optional(Type.Boolean()),
    mimetype: Type.Literal('text/csv')
});

export const CsvBodySchema = Type.Object({
    csv: CsvFile,
    delimiter: Type.Optional(Type.String({ default: ';' })),
    headerLine: Type.Optional(Type.Number({ default: 0 })),
    ignoreLastLine: Type.Optional(Type.Boolean({ default: false }))
});

export type CsvUploadBody = Static<typeof CsvBodySchema>;