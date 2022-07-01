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
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'questionId',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              // ниже имитация виртуального поля avatar, т.к. mongoose не поддерживает
              // добавление виртуальных полей при использовании aggregate
              pipeline: [
                {
                  $addFields: {
                    'avatar.thumbnail': { $concat: ['$avatarUrl', '&s=96'] },
                    'avatar.full': '$avatarUrl',
                  },
                },
                { $project: { avatarUrl: 1, name: 1, avatar: 1 } },
              ],
              as: 'author',
            },
          },
        ],
        as: 'lastComment',
      },
    },
    {
      $unwind: {
        path: '$lastComment',
        preserveNullAndEmptyArrays: true,
      },
    },
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
