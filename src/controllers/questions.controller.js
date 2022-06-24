const User = require('../models/User.model');
const { catchError } = require('../utils/catchError');
const { getAuthInfo } = require('../services/user.service');
const {
  getQuestions,
  addQuestion,
  getQuestion,
  deleteQuestionById,
  restoreQuestionById,
  addQuestionToUserFavorites,
  removeQuestionFromUserFavorites,
} = require('../services/questions.service');
const ApiError = require('../utils/ApiError.class');

const getQuestionsController = catchError(async (req, res) => {
  const { query } = req;
  const { QUESTIONS_PER_PAGE, MAX_QUESTIONS_PER_PAGE } = process.env;

  // допустимые поля для фильтрации
  const { tag, search } = query;
  const deletedOnly = !!query.deletedOnly;
  const favoritesOnly = !!query.favoritesOnly;

  let limit = Math.abs(Number(query.limit || QUESTIONS_PER_PAGE));
  const offset = Number(query.offset || 0);

  const maxLimit = Number(MAX_QUESTIONS_PER_PAGE);

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  const options = {
    limit,
    offset,
  };

  // если указан favoritesOnly, то пользователь должен быть авторизован, нужен его id
  if (favoritesOnly) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error('Для использования флага favoritesOnly нужно быть авторизованным');
    }

    options.user = await getAuthInfo(authorization);
  }

  const { total, items } = await getQuestions(
    {
      tag,
      search,
      deletedOnly,
      favoritesOnly,
    },
    options
  );

  return res.json({ total, items });
});

const addQuestionController = catchError(async (req, res) => {
  const { question, fullDescription, tags } = req.body;
  const author = req.user.userId;

  const createdQuestion = await addQuestion({
    question,
    fullDescription,
    tags,
    author,
  });

  const questionToResponse = await getQuestion({ _id: createdQuestion._id });

  return res.json({ question: questionToResponse });
});

const getQuestionByIdController = catchError(async (req, res) => {
  const { _id } = req.params;
  const question = await getQuestion({ _id });

  return res.json(question);
});

const deleteQuestionController = catchError(async (req, res) => {
  // ID удаляемого вопроса
  const { id } = req.params;

  // ID текущего юзера
  const { userId } = req.user;

  // Нужно проверить есть права у текущего пользователя
  const user = await User.findById(userId);

  if (user.isAdmin) {
    await deleteQuestionById(id);

    return res.json({ message: 'Вопрос удален' });
  }

  // если не удалось удалить
  throw new ApiError('У вас недостаточно прав для удаления', 403);
});

const restoreQuestionController = catchError(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  const user = await User.findById(userId);

  if (user.isAdmin) {
    await restoreQuestionById(id, { $set: { deleted: 'false' } });

    return res.json({ message: 'Вопрос возвращен из корзины' });
  }

  throw new ApiError('У вас недостаточно прав для этой операции', 403);
});

const addQuestionToFavoritesController = catchError(async (req, res) => {
  const questionId = req.params.id;
  const { userId } = req.user;

  await addQuestionToUserFavorites(questionId, userId);

  res.json({
    message: 'Вопрос добавлен в избранные',
  });
});

const removeQuestionFromFavoritesController = catchError(async (req, res) => {
  const questionId = req.params.id;
  const { userId } = req.user;

  await removeQuestionFromUserFavorites(questionId, userId);

  res.json({
    message: 'Вопрос удален из избранных',
  });
});

module.exports = {
  getQuestionsController,
  addQuestionController,
  getQuestionByIdController,
  deleteQuestionController,
  restoreQuestionController,
  addQuestionToFavoritesController,
  removeQuestionFromFavoritesController,
};
