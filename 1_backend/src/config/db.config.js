/**
 * Подключение MongoDB
 * */
import mongoose from 'mongoose';
import { initCronTasks } from "../cron/getRates.cron.js";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `🟢 MongoDB подключен: ${connection.connection.host}`
    );
    // Запускаем синхронизацию один раз сразу при старте сервера, чтобы в базе появились данные
    await initCronTasks();

  } catch (error) {
    console.error('🔴 Ошибка подключения к MongoDB', error.message);

    process.exit(1);
  }
};

export default connectDB;
