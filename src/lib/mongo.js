import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_CONNECTION_STRING;

if (!MONGODB_URI) {
    throw new Error("MONGO_DB_CONNECTION_STRING is not defined in .env");
}

// Global cache to prevent multiple reconnections
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
    if (cached.conn) {
        console.log("Using existing database connection.");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("Establishing new database connection...");
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
