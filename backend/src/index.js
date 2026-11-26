import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import wedangRoutes from "./routes/wedangRoutes.js";
import { checkSupabaseConnection } from "./config/supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint root untuk pengecekan status API
app.get("/", (req, res) => {
  res.json({
    name: "WedangNusa REST API",
    version: "1.1.0",
    endpoints: {
      health: "/api/health",
      drinks: "/api/drinks",
      drinkDetail: "/api/drinks/:id",
      spices: "/api/spices",
      spiceDetail: "/api/spices/:id",
    },
  });
});

// Endpoint pengecekan koneksi database Supabase
app.get("/api/health", async (req, res) => {
  const dbStatus = await checkSupabaseConnection();
  const statusCode = dbStatus.connected ? 200 : 503;

  res.status(statusCode).json({
    success: dbStatus.connected,
    service: "WedangNusa API",
    database: "Supabase PostgreSQL",
    ...dbStatus,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", wedangRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server WedangNusa API berjalan di http://localhost:${PORT}`);
  });
}

export default app;