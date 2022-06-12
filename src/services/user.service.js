const jwt = require('jsonwebtoken');

const getAuthInfo = async (token) => {
  if (!token) {
    throw new Error('authorization request');
  }

  const [typeOfToken, tokenString] = token.split(' ');

  if (typeOfToken !== 'Bearer') {
    throw new Error('Поддерживается только тип токена Bearer');
  }

  return jwt.verify(tokenString, process.env.JWT_SECRET_KEY);
};

module.exports = {
  getAuthInfo,
};
