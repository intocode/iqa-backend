class ApiError extends Error {
  constructor(message, httpStatusCode) {
    super(message);

    this.message = message;
    this.httpStatusCode = httpStatusCode;
  }
}

module.exports = ApiError;
