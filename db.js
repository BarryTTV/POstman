import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables del archivo .env

const MONGO_URI = process.env.MONGO_URI; // Leer la variable desde .env

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected Successfully!!!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
    }
};
