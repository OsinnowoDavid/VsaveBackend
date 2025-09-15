"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        mongoose_1.default.connection.on("error", (err) => {
            console.error("DB connection error:", err);
        });
        let dev_DB = "mongodb://127.0.0.1/vsave";
        const uri = `${process.env.MONGODB_URI}/Vsave`;
        await mongoose_1.default.connect(uri);
        console.log("MongoDB connection established");
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit the application on connection error
    }
};
exports.default = connectDB;
