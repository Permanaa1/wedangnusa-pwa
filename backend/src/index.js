import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import wedangRoutes from "./routes/wedangRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint root untuk pengecekan status API
app.get("/", (req, res) => {
  res.json({
    name: "WedangNusa REST API",
    version: "1.0.0",
    endpoints: {
      drinks: "/api/drinks",
      drinkDetail: "/api/drinks/:id",
      spices: "/api/spices",
      spiceDetail: "/api/spices/:id",
    },
  });
});

app.use("/api", wedangRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server WedangNusa API berjalan di http://localhost:${PORT}`);
  });
}

export default app;