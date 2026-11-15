const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();
const app = express();
const authRoutes = require("./routes/authRoutes");
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HomeStudy API is running!",
  });
});
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`HomeStudy server running on port ${PORT}`);
  });
};
startServer();