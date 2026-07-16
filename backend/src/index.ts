import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`VioNest backend listening on port ${PORT}`);
});
