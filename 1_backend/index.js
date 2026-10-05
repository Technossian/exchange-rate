/**
 * Точка входа. Здесь только запуск сервера и подключение к базе.
 * */
import dotenv from "dotenv";

dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.config.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
      console.log(`📦 Environment: ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log('Unhandled Rejection:', err);

      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.log('Uncaught exception:', err);

      process.exit(1);
    });
  } catch (error) {
    console.error('🔴 Ошибка запуска сервера:', error)
  }
}

startServer();
