const Comment = require('../models/Comment.model');

const getComments = async (filter) => {
  const comments = await Comment.find(filter).populate('author', { id: 1, name: 1, avatarUrl: 1 });

  return comments;
};

const addNewComment = async ({ questionId, text, author }) => {
  const createdComment = await Comment.create({
    text,
    author,
    questionId,
  });

  return createdComment;
};

const deleteCommentById = (commentId) => Comment.findByIdAndDelete(commentId);

module.exports = { getComments, addNewComment, deleteCommentById };
