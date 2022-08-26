const { addLikeComment, unlikeComment } = require('../services/likes.service');
const { getComments } = require('../services/comments.service');
const { catchError } = require('../utils/catchError');

const addLikeController = catchError(async (req, res) => {
  // ID комментария, где ставится лайк
  const { commentId } = req.params;
  // ID пользователя, который ставит лайк
  const { userId } = req.user;

  const likedComment = await addLikeComment({ commentId, userId });

  const populatedComment = await getComments({ _id: likedComment._id });

  // возвращаем объект комментария, чтоб было легче обновить его состояние на фронте
  return res.json(populatedComment);
});

const unlikeController = catchError(async (req, res) => {
  // ID комментария, где убирается лайк
  const { commentId } = req.params;

  // ID текущего юзера
  const { userId } = req.user;

  const unlikedComment = await unlikeComment({ commentId, userId });

  const populatedComment = getComments({ _id: unlikedComment._id });

  // возвращаем объект комментария, чтоб было легче обновить его состояние на фронте
  return res.json(populatedComment);
});

module.exports = {
  addLikeController,
  unlikeController,
};
