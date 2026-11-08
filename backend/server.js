
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("StockFlow API is running!");
});

// Start server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
