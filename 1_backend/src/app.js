import express from "express";
import helmet from "helmet";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import compression from "compression";
import { rateLimit } from 'express-rate-limit';
import { XMLParser } from 'fast-xml-parser';
import iconv from "iconv-lite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

/**
 * РОУТЫ
 * */
import routes from "./routes/index.routes.js";

/**
 * Получаем путь к текущей директории
 * */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * MIDDLEWARES
 * */
import notfoundMiddleware from "./middlewares/notfound.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

/**
 * БЕЗОПАСНОСТЬ
 * */
app.use(helmet());  // Безопасность http заголовков

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Лимит запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: '⛔️ Вы превысили лимит запросов. Пожалуйста, попробуйте позже через 15 минут.'
  },
});
app.use('/api', limiter);

// Предотвращение подмены параметров HTTP ?? (Prevent HTTP Parameter Pollution)
app.use(hpp());

/**
 * BODY PARSING
 * */
app.use(
  express.json({
    limit: "10kb",
  })
)

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
)

app.use(express.static("public"));

/**
 * ПРОИЗВОДИТЕЛЬНОСТЬ
 * */

app.use(compression());

/**
 * Логирование
 * */
if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

/**
 * Hello server
 * */
app.get("/", async (req, res,next) => {
  try {
    // Путь к html файлу
    const viewPath = path.join(__dirname, 'src','views','index.html');

    // Читаем файл
    let html = await fs.readFile(viewPath, 'utf8');

    // Динамически подставляем переменные окружения
    const env = process.env.NODE_ENV || "development";
    html = html.replace('{{NODE_ENV}}', env);

    res.type('html')
      .send(html);

  } catch (error) {
    // Передаем ошибку в middleware
    next(error);
  }
})

/**
 * API ROUTES
 * */
app.use('/api/v1/', routes);

/**
 * ОБРАБОТЧИК ОШИБОК
 * */
app.use(notfoundMiddleware);
app.use(errorMiddleware);


export default app;
