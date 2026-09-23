// Load environment variables from .env
require("dotenv").config();

// Imports
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const app = express();
const PORT = 4000;

const startServer = async () => {
    try {
        await connectDB();

        app.use(express.json());

        app.get("/", (req, res) => {
            res.json({
                message: "HustleHub+ API is running"
            });
        });

        app.use("/api/auth", authRoutes);
        app.use(errorHandler);

        if (process.env.USE_HTTPS === "true") {

            const sslOptions = {
                key: fs.readFileSync(process.env.SSL_KEY_PATH),
                cert: fs.readFileSync(process.env.SSL_CERT_PATH)
            };

            https.createServer(sslOptions, app).listen(PORT, () => {
                console.log(`HustleHub+ API running on https://localhost:${PORT}`);
            });

        } else {

            http.createServer(app).listen(PORT, () => {
                console.log(`HustleHub+ API running on http://localhost:${PORT}`);
            });
        }

    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();