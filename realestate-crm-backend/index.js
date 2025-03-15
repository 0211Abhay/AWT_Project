const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
const authRoutes = require("./routes/auth_routes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();
sequelize.sync().then(() => console.log("Database synchronized."));

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
