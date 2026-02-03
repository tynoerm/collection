import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL pool (NO async race condition)
const db = mysql.createPool({
  host: "109.75.161.2",
  user: "bluebabyco_bluebaby",
  password: "Bluebaby@2026!",
  database: "bluebabyco_agility_finance",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Attach DB to all requests
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
import LoginRoute from "./Routes/LoginRoute.js";
app.use("/api/login", LoginRoute);

// Health checks
app.get("/", (req, res) => res.send("API running"));

app.get("/db-test", async (req, res) => {
  try {
    await req.db.query("SELECT 1");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
