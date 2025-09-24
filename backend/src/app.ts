import express, { Request, Response } from "express";

// Extend the Request interface to include the file property
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}
import config from "./config/config";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import axios from "axios";
import FormData from  "form-data";
import  fs from  "fs";

import multer from "multer";
import { spawn } from "child_process";
import path from  "path";


const upload = multer({ dest: "uploads/" }); 

import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));


app.use((req, res, next) => {
  next();
});

app.use("/api/health", upload.single('image'), (req: Request, res: Response) => {
  res.json({ message: "Server Running Perfect 🟢" });
});


app.post("/api/detect/image",(req: Request, res: Response) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);

    // Spawn Python script
    const pyProcess = spawn("python", ["./python_scripts/detect.py", filePath]);

    let output = "";
    pyProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
        console.error("Python error:", data.toString());
    });

    pyProcess.on("close", (code) => {
        try {
            const result = JSON.parse(output);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Failed to parse Python output", details: output });
        }
    });
});


app.post("/detect/video", upload.single("video"), (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
    }

    const videoPath = path.resolve(req.file.path);
    const scriptPath = path.resolve(__dirname, "../python_scripts/detect.py");

    const pyProcess = spawn("python", [scriptPath, videoPath]);

    let output = "";
    pyProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pyProcess.stderr.on("data", (data) => {
        console.error("Python error:", data.toString());
    });

    pyProcess.on("close", (code) => {
        // Clean up uploaded file
        fs.unlink(videoPath, (err) => {
            if (err) console.error("Failed to delete video:", err);
        });

        try {
            const result = JSON.parse(output);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: "Failed to parse Python output", details: output });
        }
    });
});



app.use(errorHandler);
export default app;
