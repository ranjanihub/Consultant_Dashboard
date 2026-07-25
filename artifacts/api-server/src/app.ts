import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import path from "node:path";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Also support non-/api endpoint calls if client explicitly requests JSON
app.use((req, res, next) => {
  if (req.headers.accept?.includes("application/json") || req.xhr) {
    router(req, res, next);
    return;
  }
  next();
});

// Serve static frontend files from root public folder
const publicPath = path.resolve(globalThis.__dirname || process.cwd(), "public");
app.use(express.static(publicPath));

// Fallback to index.html for React SPA routing
app.get("/{*splat}", (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Error handler middleware to prevent uncaught 500 server crashes
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});

export default app;
