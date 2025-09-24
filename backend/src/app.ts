import express, { Request, Response } from "express";

// Extend the Request interface to include the file property
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";
import cookieParser from "cookie-parser";

// Ensure uploads directory exists at startup
const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

const app = express();

// Allow requests from the extension as well as local dev
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "chrome-extension://hcndkeangcokeallhnkhjaceedcjpcjj"
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  next();
});

app.use("/api/health", (req: Request, res: Response) => {
  res.json({ message: "Server Running Perfect 🟢" });
});

app.post("/api/detect", upload.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);
    const pythonScript = path.resolve("deepfake-model/ml_inference.py");

    const pyProcess = spawn("python3", [pythonScript, filePath]);

    let output = "";
    let errors = "";

    pyProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
      errors += data.toString();
    });

    pyProcess.on("close", (code) => {
      try {
        const result = JSON.parse(output);
        res.json(result);
      } catch (e) {
        res.status(500).json({
          error: "Failed to parse Python output",
          stdout: output,
          stderr: errors,
          code,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : err,
    });
  }
});

app.use(errorHandler);
export default app;
