const catchError = (asyncCallBackFunction) => async (req, res, next) => {
  try {
    await asyncCallBackFunction(req, res, next);
  } catch (e) {
    const { message, httpStatusCode } = e;

    const statusCode = httpStatusCode || 500;

    res.status(statusCode).json({
      error: 'Произошла ошибка при обработке запроса',
      message,
    });
  }
};

module.exports = {
  catchError,
};
