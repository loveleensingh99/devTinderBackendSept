const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/devTinder",);
        console.log("✅ MongoDB connected:", conn.connection.name);
        return conn;
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        throw err;
    }
};

module.exports = connectDb
