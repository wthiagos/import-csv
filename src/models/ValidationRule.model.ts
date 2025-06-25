import { Schema, model } from "mongoose";

const validationRuleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    code: String // optional if you're storing function body as string
});

export const ValidationRuleModel = model('ValidationRule', validationRuleSchema);
