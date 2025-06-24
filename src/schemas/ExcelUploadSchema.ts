import { Type } from '@sinclair/typebox';

export const ExcelUploadSchema = Type.Object({
    excel: Type.Any(),
    sheetsToIgnore: Type.Optional(
        Type.Array(Type.Object({ value: Type.String() }))
    ),
    headerLine: Type.Optional(
        Type.Object({ value: Type.Number({ default: 0 }) })
    ),
    ignoreLastLine: Type.Optional(
        Type.Object({ value: Type.Boolean({ default: false }) })
    )
}, { additionalProperties: false });

export type ExcelUploadBody = typeof ExcelUploadSchema.static;
