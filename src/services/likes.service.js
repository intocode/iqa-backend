const Comment = require('../models/Comment.model');

const likedComment = async ({ commentId, userId }) => {
  const addALike = await Comment.findByIdAndUpdate(
    commentId,
    { $addToSet: { likes: userId } },
    { new: true }
  );

  return addALike;
};

const unlikedComment = async ({ commentId, userId }) => {
  const removeLike = await Comment.findByIdAndUpdate(
    commentId,
    { $pull: { likes: userId } },
    { new: true }
  );

  return removeLike;
};

module.exports = { likedComment, unlikedComment };
