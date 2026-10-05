const notfoundMiddleware = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `❌ Роут не найден: ${req.method} ${req.originalUrl}`,
  });
}

export default notfoundMiddleware;
