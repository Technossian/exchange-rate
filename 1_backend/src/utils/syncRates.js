import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import iconv from 'iconv-lite';
import Rate from '../models/Rate.model.js'; // Укажите правильный путь к вашей модели

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp'

// Список валют для фильтрации
const ALLOWED_CURRENCIES = ["GBP", "AMD", "BYN", "GEL", "AED", "USD", "EUR", "TRY"];

export async function syncRatesWithCBR() {
  try {
    console.log('Начало синхронизации курсов с ЦБ РФ...');

    const response = await axios.get(CBR_URL, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Connection': 'keep-alive',
        'Host': 'www.cbr.ru'
      },
      timeout: 15000
    });

    const xmlData = iconv.decode(Buffer.from(response.data), 'windows-1251');

    if (!xmlData.includes('</ValCurs>')) {
      throw new Error('Данные от ЦБ РФ были обрезаны при скачивании.');
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: false
    });

    const jsonObj = parser.parse(xmlData);
    const valutes = Array.isArray(jsonObj.ValCurs.Valute)
      ? jsonObj.ValCurs.Valute
      : [jsonObj.ValCurs.Valute];

    // Счётчик для логов
    let savedCount = 0;

    for (const v of valutes) {
      const code = v.CharCode;

      // 1. Фильтруем: пропускаем валюту, если её нет в вашем списке
      if (!ALLOWED_CURRENCIES.includes(code)) {
        continue;
      }

      const rateData = {
        code: code,
        name: v.Name,
        nominal: parseInt(v.Nominal, 10),
        value: parseFloat(String(v.Value).replace(',', '.'))
      };

      // 2. Сохраняем или обновляем документ в MongoDB по полю code
      await Rate.findOneAndUpdate(
        { code: code },
        rateData,
          {
            upsert: true,
            returnDocument: 'after',
            setDefaultsOnInsert: true
          }
        )

      savedCount++;
    }

    console.log(`✅ Синхронизация успешно завершена. Сохранено/обновлено валют: ${savedCount}`);
  } catch (error) {
    console.error('⛔️ Ошибка при синхронизации с ЦБ:', error.message);
  }
}
