import express from "express";
import cors from "cors";
import { tasksRouter } from "./routes/tasks.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check usado pelo pipeline de CD (smoke test pós-deploy).
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/tasks", tasksRouter);

  return app;
}
