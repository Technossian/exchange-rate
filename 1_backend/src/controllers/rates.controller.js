import Rate from "../models/Rate.model.js";
import History from "../models/History.model.js";
import {syncRatesWithCBR} from "../utils/syncRates.js";

export const rateController = {

  getRates: async (req, res) => {
    const targetCurrency = req.query.target;

    if (targetCurrency) {
      await History.create({
        toCurrency: targetCurrency
      });
    }

    try {
      // Получаем все отфильтрованные ранее валюты из MongoDB
      const rates = await Rate.find()
        .select('-__v'); // Исключаем системное поле версии __v

      // Извлекаем последние 10 запросов истории (сортируем по убыванию времени)
      const historyLogs = await History.find({})
        .sort({ timestamp: -1 })
        .limit(10)
        .select('-__v');

      // Возвращаем массив курсов
      res.json({
        success: true,
        count: rates.length,
        rates: rates,
        history: historyLogs
      });

    } catch (error) {
      console.error('Ошибка при получении курсов из БД:', error.message);
      res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
    }
  },

  refreshRates: async (req, res) => {
    const body = req.body
    if (!body) return res.status(422).json({success: false, message: 'Нет тела запроса!'})

    await syncRatesWithCBR()

    return res.status(200).json({success: true, message: '🔥 Курсы обновлены!'})

    try {
      console.log('Example');
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

}

// // Официальный URL ЦБ РФ для ежедневных курсов
// const CBR_URL = 'http://www.cbr.ru/scripts/XML_daily.asp'
//
// app.get('/api/v1', async (req, res) => {
//   try {
//     // Делаем комплексный запрос, чтобы ЦБ воспринимал Node.js как полноценный браузер
//     const response = await axios.get(CBR_URL, {
//       responseType: 'arraybuffer',
//       // Обязательные заголовки, предотвращающие защитную блокировку и обрыв связи со стороны ЦБ
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
//         'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
//         'Connection': 'keep-alive',
//         'Host': 'www.cbr.ru'
//       },
//       timeout: 15000 // Расширенный таймаут для стабильности соединения
//     });
//
//     // Декодируем бинарный буфер из родной кодировки ЦБ (windows-1251) в UTF-8 строку
//     const xmlData = iconv.decode(Buffer.from(response.data), 'windows-1251');
//
//     // Проверка на целостность структуры. Если корневой тег не закрыт — XML скачался не до конца.
//     if (!xmlData.includes('</ValCurs>')) {
//       throw new Error('Получен неполный XML-пакет от сервера ЦБ. Повторите запрос.');
//     }
//
//     // Инициализируем парсер с отключением принудительного разбора типов данных
//     const parser = new XMLParser({
//       ignoreAttributes: false,
//       parseTagValue: false
//     });
//
//     const jsonObj = parser.parse(xmlData);
//
//     // Валидация структуры данных
//     if (!jsonObj.ValCurs || !jsonObj.ValCurs.Valute) {
//       throw new Error('XML-ответ от ЦБ не содержит ожидаемую структуру валют.');
//     }
//
//     // Защита на случай, если вернется всего одна валюта (чтобы всегда был массив)
//     const valutes = Array.isArray(jsonObj.ValCurs.Valute)
//       ? jsonObj.ValCurs.Valute
//       : [jsonObj.ValCurs.Valute];
//
//     // Приведение полей к единому контракту для Angular приложения
//     const formattedRates = valutes.map(v => ({
//       code: v.CharCode,
//       name: v.Name,
//       nominal: parseInt(v.Nominal, 10),
//       // Заменяем русскую разделительную запятую на точку для корректного Float
//       value: parseFloat(String(v.Value).replace(',', '.'))
//     }));
//
//     // Возвращаем чистый JSON на фронтенд
//     res.json({
//       date: jsonObj.ValCurs['@_Date'],
//       rates: formattedRates
//     });
//
//   } catch (error) {
//     console.error('Ошибка работы с официальным API ЦБ:', error.message);
//     res.status(500).json({
//       error: 'Не удалось получить актуальные курсы с официального сервера ЦБ РФ.',
//       details: error.message
//     });
//   }
// });
