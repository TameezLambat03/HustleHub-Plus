require("dotenv").config();
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const gigRoutes = require("./routes/gigRoutes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. BODY PARSER MUST COME FIRST ---
app.use(express.json());

// --- 2. CUSTOM SECURITY SANITIZATION MIDDLEWARE ---
const customSanitizer = (req, res, next) => {
    const cleanNoSQL = (obj) => {
        if (!obj) return;
        for (let key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                cleanNoSQL(obj[key]);
            }
        }
    };

    const cleanXSS = (obj) => {
        if (!obj) return;
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/<[^>]*>?/gm, '');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                cleanXSS(obj[key]);
            }
        }
    };

    cleanNoSQL(req.body);
    cleanNoSQL(req.params);
    cleanXSS(req.body);
    cleanXSS(req.params);
    
    if (req.query) {
        cleanNoSQL(req.query);
        cleanXSS(req.query);
    }
    next();
};
// -----------------------------------------------

// 3. Security Middlewares
app.use(helmet()); 
app.use(customSanitizer); 

// 4. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: { success: false, message: "Too many requests, please try again later." }
});
app.use("/api", limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts, please try again later." }
});

app.get("/", (req, res) => {
    res.json({ message: "HustleHub+ API is running" });
});

// 5. Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/gigs", gigRoutes); 

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();

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