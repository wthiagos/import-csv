import { Static, Type } from '@sinclair/typebox';

export const ExcelUploadSchema = Type.Object({
    excel: Type.Any(), // Accept any file; actual validation should occur in controller
    sheetsToIgnore: Type.Optional(
        Type.Array(
            Type.Object({
                value: Type.String()
            })
        )
    ),
    headerLine: Type.Optional(
        Type.Object({
            value: Type.Number({ default: 0 })
        })
    ),
    ignoreLastLine: Type.Optional(
        Type.Object({
            value: Type.Boolean({ default: false })
        })
    )
}, {
    additionalProperties: false
});

// 👇 This gives you strong typing for req.body
export type ExcelUploadBody = Static<typeof ExcelUploadSchema>;
