import { Schema, Types, model } from "mongoose";

const columnSchema = new Schema({
    sheetId: { type: Types.ObjectId, ref: 'Sheet', required: true },
    originalName: { type: String, required: true },
    propertyName: { type: String, required: true },
    index: { type: Number },
    inferredType: {
        type: String,
        enum: ['string', 'number', 'boolean', 'date', 'unknown'],
        default: 'unknown'
    },
    isRequired: { type: Boolean, default: false },
    validations: [{ type: String }], // could also be ObjectId if referencing a "Validation" collection
    cleaners: [{ type: String }]
});

export const ColumnModel = model('Column', columnSchema);
