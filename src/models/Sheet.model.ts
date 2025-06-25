import { Schema, Types, model } from "mongoose";

const sheetSchema = new Schema({
    fileId: { type: Types.ObjectId, ref: 'File', required: true },
    sheetName: { type: String, required: true },
    order: { type: Number },
});

export const SheetModel = model('Sheet', sheetSchema);
