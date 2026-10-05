/*
* ГЛАВНЫЙ ФАЙЛ РОУТОВ
* */
import { Router } from "express";

/**
 * Импорт роутов ФИЧ
 * */
import ratesRouter from "../routes/rates/rates.routes.js"

const router = Router();


/**
 * Импорт роутов ФИЧ
 * */
router.use("/rates", ratesRouter);

export default router;
