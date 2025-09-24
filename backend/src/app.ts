import express, { Request, Response } from "express";
import config from "./config/config";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

import cookieParser from 'cookie-parser'

const app = express();


app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(cookieParser())
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  next();
});

app.use('/api/health', (req: Request, res: Response) => {
  res.json({ message: "Server Running Perfect 🟢" })
})




app.use(errorHandler);
export default app;