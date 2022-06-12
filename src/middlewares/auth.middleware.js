const { getAuthInfo } = require('../services/user.service');
const ApiError = require('../utils/ApiError.class');
const { catchError } = require('../utils/catchError');

module.exports = catchError(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new ApiError('"authorization" header required', 401);
  }

  const authPayload = await getAuthInfo(authorization);

  req.user = authPayload;

  return next();
});
