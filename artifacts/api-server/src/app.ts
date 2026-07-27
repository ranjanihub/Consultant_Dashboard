import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import path from "node:path";
import router from "./routes";

import fs from "node:fs";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes at both /api and root level for maximum compatibility
app.use("/api", router);
app.use(router);

// Serve static frontend files from root public folder if present
const publicPath = path.resolve(globalThis.__dirname || process.cwd(), "public");
app.use(express.static(publicPath));

// Fallback to index.html for React SPA routing if index.html exists, else return API 404 JSON
app.get("/{*splat}", (req: Request, res: Response) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: `Route '${req.path}' not found.` });
  }
});

// Error handler middleware to prevent uncaught 500 server crashes
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});

export default app;
