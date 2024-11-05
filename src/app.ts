import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { loadEnv, connectDb, disconnectDB } from "./config";
import { authRouter } from "./routes/auth-route";
import { communityRouter } from "./routes/community-route";
import { orderRouter } from "./routes/order-route";
import { reviewRouter } from "./routes/review-route";
import { serviceRouter } from "./routes/service-route";
import { userRouter } from "./routes/user-route";

loadEnv();

const app = express();
app
  .use(cors())
  .use(express.json())
  .use("/auth", authRouter)
  .use("/communities", communityRouter)
  .use("/orders", orderRouter)
  .use("/reviews", reviewRouter)
  .use("/services", serviceRouter)
  .use("/users", userRouter)

  // Middleware de erro
  .use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Erro não capturado:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  });

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
