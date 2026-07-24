import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.status(204).end();
});

app.use("/api", router);
app.use("/", router);

// Error handler middleware to prevent uncaught 500 server crashes
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});

export default app;
