import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import authRouter from "./routes/auth";
import conversationsRouter from "./routes/conversations";
import listingsRouter from "./routes/listings";
import paymentRequestsRouter from "./routes/payment-requests";
import profileRouter from "./routes/profile";
import { UPLOAD_DIR } from "./middleware/upload";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/listings", listingsRouter);
app.use("/api/conversations", conversationsRouter);
app.use("/api/payment-requests", paymentRequestsRouter);

const PORT = process.env.PORT ?? 4000;

app.listen(PORT, () => {
  console.log(`VioNest backend listening on port ${PORT}`);
});
