const { Types } = require('mongoose');
const Question = require('../models/Question.model');

const addQuestion = async (options) => {
  const { question, fullDescription, tags, author } = options;

  const createdQuestion = await Question.create({
    question,
    fullDescription,
    tags,
    author,
  });

  return createdQuestion;
};

const getQuestions = async (filter = {}, options = {}) => {
  const questionsPerPage = Number(process.env.QUESTIONS_PER_PAGE);

  const { limit = questionsPerPage, offset = 0 } = options;

  const extendedFilter = {
    deleted: filter.deletedOnly || false,
  };

  if (filter.tags) {
    extendedFilter.tags = filter.tag;
  }

  if (filter.search) {
    extendedFilter.$text = { $search: filter.search };
  }

  if (filter.favoritesOnly) {
    extendedFilter.usersThatFavoriteIt = Types.ObjectId(options.user.userId);
  }

  if (filter.tag) {
    extendedFilter.tags = filter.tag;
  }

  if (filter._id) {
    extendedFilter._id = Types.ObjectId(filter._id);
  }

  const totalQuestionsAfterAggregateWithoutLimit = await Question.countDocuments(extendedFilter);

  const questions = await Question.aggregate([
    { $match: { ...extendedFilter } },
    { $sort: { createdAt: -1 } },
    { $skip: offset },
    { $limit: limit },
  ]);

  const authorPopulatedQuestions = await Question.populate(questions, {
    path: 'author',
    select: { name: 1, githubId: 1, avatarUrl: 1 },
  });

  return {
    items: authorPopulatedQuestions,
    total: totalQuestionsAfterAggregateWithoutLimit,
  };
};

const getQuestion = async (filter = {}, options = {}) => {
  await Question.findByIdAndUpdate(filter._id, { $inc: { views: 1 } });
  const questions = await getQuestions(filter, options);

  return questions.items[0];
};

const deleteQuestionById = (questionId) =>
  Question.findByIdAndUpdate(questionId, { $set: { deleted: true } });

const restoreQuestionById = (questionId) =>
  Question.findByIdAndUpdate(questionId, { $set: { deleted: false } });

const addQuestionToUserFavorites = async (questionId, userId) =>
  Question.findByIdAndUpdate(questionId, {
    $addToSet: { usersThatFavoriteIt: userId },
  });

const removeQuestionFromUserFavorites = async (questionId, userId) =>
  Question.findByIdAndUpdate(questionId, {
    $pull: { usersThatFavoriteIt: userId },
  });

module.exports = {
  addQuestion,
  getQuestion,
  getQuestions,
  deleteQuestionById,
  restoreQuestionById,
  addQuestionToUserFavorites,
  removeQuestionFromUserFavorites,
};
