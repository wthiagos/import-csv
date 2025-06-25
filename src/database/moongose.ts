// src/database/mongoose.ts
import mongoose from 'mongoose';
import { env } from '../env/index.js';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};