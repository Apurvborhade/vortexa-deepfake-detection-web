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
import fetch from "node-fetch";

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

app.post("/api/detect", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Determine file type and select the correct API endpoint
    const mimeType = req.file.mimetype;
    let apiEndpoint = "https://api.aiornot.com/v2/image/sync";
    // If video file, change endpoint
    if (mimeType && mimeType.startsWith("video/")) {
      apiEndpoint = "https://api.aiornot.com/v2/video/sync";
    }

    const fileStream = fs.createReadStream(req.file.path);
    const form = new (require('form-data'))();
    // Use the field name 'image' for images, 'video' for videos
    const fieldName = mimeType && mimeType.startsWith("video/") ? 'video' : 'image';
    form.append(fieldName, fileStream, req.file.originalname);

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.AIORNOT_API_KEY}`,
        // form-data will set proper headers automatically
        ...form.getHeaders()
      },
      body: form,
    });

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching AI or Not API:", error);
    res.status(500).json({ error: "Failed to contact AI or Not API" });
  }
});

app.use(errorHandler);
export default app;
