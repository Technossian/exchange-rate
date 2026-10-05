import cron from 'node-cron';
import {syncRatesWithCBR} from "../utils/syncRates.js";

export async function initCronTasks() {
  try {
    // 1. Запускаем синхронизацию один раз сразу при старте сервера после подключения к БД
    console.log('Первоначальный запуск синхронизации при старте...');
    await syncRatesWithCBR();

    // 2. Настраиваем ежедневный запуск в 18:15 по МСК
    // Маска: 'минуты часы день_месяца месяц день_недели'
    cron.schedule('15 18 * * *', async () => {
      console.log('Запуск ежедневной синхронизации по расписанию (18:15 МСК)...');
      await syncRatesWithCBR();
    }, {
      scheduled: true,
      timezone: "Europe/Moscow" // Строго фиксируем часовой пояс МСК
    });

    console.log('✅ Планировщик задач успешно инициализирован.');
  } catch (error) {
    console.error('❌ Ошибка при инициализации планировщика:', error.message);
  }
}
