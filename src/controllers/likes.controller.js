const { likedComment, unlikedComment } = require('../services/likes.service');
const { getComments } = require('../services/comments.service');
const { catchError } = require('../utils/catchError');

const addLikeController = catchError(async (req, res) => {
  // ID комментария, где ставится лайк
  const { id } = req.params;
  // ID пользователя, который ставит лайк
  const { userId } = req.user;

  const addALike = await likedComment({ id, userId });

  const populatedComment = await getComments({ _id: addALike._id });
  
  // возвращаем объект комментария, чтоб было легче обновить его состояние на фронте
  return res.json(populatedComment);
});

const removeLikeController = catchError(async (req, res) => {
  // ID комментария, где убирается лайк
  const { id } = req.params;

  // ID текущего юзера
  const { userId } = req.user;

  const unLiked = await unlikedComment({ id, userId });

  const populatedComment = getComments({ _id: unLiked._id });
  
  // возвращаем объект комментария, чтоб было легче обновить его состояние на фронте
  return res.json(populatedComment);
});

module.exports = {
  addLikeController,
  removeLikeController,
};
