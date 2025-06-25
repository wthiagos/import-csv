import { Schema, model, Types } from 'mongoose';

const fileSchema = new Schema({
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploaderId: { type: Types.ObjectId, ref: 'User' }, // optional
});

export const FileModel = model('File', fileSchema);
