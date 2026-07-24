import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

if (!process.env.VERCEL) {
  try {
    const pinoHttp = require("pino-http");
    const pinoMiddleware = (typeof pinoHttp === "function" ? pinoHttp : pinoHttp.pinoHttp || pinoHttp.default) as any;
    app.use(
      pinoMiddleware({
        logger,
        serializers: {
          req(req: any) {
            return {
              id: req.id,
              method: req.method,
              url: req.url?.split("?")[0],
            };
          },
          res(res: any) {
            return {
              statusCode: res.statusCode,
            };
          },
        },
      }),
    );
  } catch (e) {
    // fallback
  }
} else {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.use("/", router);

// Error handler middleware to prevent uncaught 500 server crashes
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});

export default app;
