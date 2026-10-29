import "dotenv/config";
import app from "./app";
import logger from "./config/logger";
import prisma from "./config/database";
import fs from "fs";

const PORT = process.env.PORT || 5000;

// Ensure logs directory exists (skip on Vercel — filesystem is not for persistent logs)
if (!process.env.VERCEL && !fs.existsSync("logs")) fs.mkdirSync("logs");

async function main() {
  try {
    // Test DB connection
    await prisma.$connect();
    logger.info("✅ Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`🚀 EduAI Backend running on http://localhost:${PORT}`);
      logger.info(`📚 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔐 Auth URL: ${process.env.BETTER_AUTH_URL}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close