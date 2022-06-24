const Comment = require('../models/Comment.model');
const Question = require('../models/Question.model');
const { getComments, addNewComment } = require('../services/comments.service');
const ApiError = require('../utils/ApiError.class');
const { catchError } = require('../utils/catchError');

const getCommentsByQuestionIdController = catchError(async (req, res) => {
  const { questionId } = req.params;

  const comments = await getComments({ questionId });

  return res.json({
    items: comments,
  });
});

const addNewCommentController = catchError(async (req, res) => {
  const { questionId } = req.params;
  const { text } = req.body;

  const question = await Question.findOne({ _id: questionId, deleted: false });

  if (!question) {
    throw new ApiError('Вопроса с таким ID не существует', 400);
  }

  const createdComment = await addNewComment({ questionId, author: req.user.userId, text });

  const populatedComment = await Comment.findById(createdComment._id).populate('author', {
    id: 1,
    name: 1,
    avatarUrl: 1,
  });

  return res.json(populatedComment);
});

module.exports = { getCommentsByQuestionIdController, addNewCommentController };
