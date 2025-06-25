import { Schema, Types, model } from "mongoose";

const rowSchema = new Schema({
    sheetId: { type: Types.ObjectId, ref: 'Sheet', required: true },
    data: { type: Schema.Types.Mixed } // or Map<string, any>
});

export const RowModel = model('Row', rowSchema);
