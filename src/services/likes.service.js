const Comment = require('../models/Comment.model');

const addLikeComment = async ({ commentId, userId }) => {
  const likedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $addToSet: { likes: userId } },
    { new: true }
  );

  return likedComment;
};

const unlikeComment = async ({ commentId, userId }) => {
  const unlikedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $pull: { likes: userId } },
    { new: true }
  );

  return unlikedComment;
};

module.exports = { addLikeComment, unlikeComment };
