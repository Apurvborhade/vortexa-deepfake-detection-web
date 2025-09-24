import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: string;
  nodeEnv: string;
  dbUrl: string;
  jwtSecret: string;
  caUrl: string;
  farmerCAUrl: string;
  processorCAUrl: string;
}


const config: Config = {
  port: process.env.PORT || "3000", 
  nodeEnv: process.env.NODE_ENV || "development",
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/tracebelity",
  jwtSecret: process.env.JWT_SECRET || "secret",
  caUrl: process.env.CA_URL || "http://localhost:8080",
  farmerCAUrl:process.env.FARMER_CA_URL || "http://localhost:8080",
  processorCAUrl:process.env.PROCESSOR_CA_URL || "http://localhost:8080",
};

export default config;