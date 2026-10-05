const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  const response = {
    success: false,
    message: error.message || '⛔️ Внутренняя ошибка сервера',
  };

  if (process.env.NODE_ENV !== 'development') {
    response.stack = error.stack;
  }

  if (error.errors.length) {
    response.errors = error.errors;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
