import { Router } from 'express';

/**
 * Импорт методов контроллера
 * */
import { rateController } from "../../controllers/rates.controller.js";
/**
 * Импорт роутов ФИЧ
 * */
const router = Router();

/**
 * Роуты Фичи
 * */
router.route('/')
  .get(rateController.getRates)
  .post(rateController.refreshRates);

export default router;
