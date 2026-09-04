require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "HustleHub+ API is running"
    });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`HustleHub+ API running on http://localhost:${PORT}`);
});