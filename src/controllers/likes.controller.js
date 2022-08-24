const Comment = require('../models/Comment.model');
const { addLike, removeLikeById } = require('../services/likes.service');
const ApiError = require('../utils/ApiError.class');
const { catchError } = require('../utils/catchError');

const addLikeController = catchError(async (req, res) => {
  // ID комментария, где ставится лайк
  const { id } = req.params;
  // ID пользователя, который ставит лайк
  const { userId } = req.body;

  const liked = await Comment.findOne({ _id: id, likes: userId });

  if (!liked) {
    throw new ApiError('Вы уже лайкнули данный комментарий.', 400);
  }

  const addALike = await addLike({ id, likes: req.user.userId });

  const populatedComment = await Comment.findById(addALike._id).populate('author', {
    id: 1,
    name: 1,
    avatarUrl: 1,
  });

  return res.json(populatedComment);
});

const removeLikeController = catchError(async (req, res) => {
  // ID комментария, где убирается лайк
  const { id } = req.params;

  // ID текущего юзера
  const { userId } = req.user;

  // Нужно проверить есть права у текущего пользователя
  const liked = await Comment.findOne({ _id: id, likes: userId });

  if (liked) {
    await removeLikeById(id);

    return res.json({ message: 'Лайк удалён' });
  }

  // если не удалось удалить
  throw new ApiError('У вас недостаточно прав для удаления лайка', 403);
});

module.exports = {
  addLikeController,
  removeLikeController,
};
