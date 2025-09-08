const mongoose = require("mongoose");
const debgr = require("debug")("development:mongoose");
require("dotenv").config(); // Load environment variables

const mongoURI = process.env.MONGODB_URI;

mongoose
    .connect(`${mongoURI}/scatch`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        debgr("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

module.exports = mongoose.connection;
