const express = require("express");

const app = express();
const PORT = 4000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "HustleHub+ API is running"
    });
});

app.listen(PORT, () => {
    console.log(`HustleHub+ API running on http://localhost:${PORT}`);
});