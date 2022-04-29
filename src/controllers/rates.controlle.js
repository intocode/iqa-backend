const Rate = require('../models/Rate.model');
const Comment = require('../models/Comment.model');
const Question = require('../models/Question.model');

module.exports.ratesController = {
  changeRate: async (req, res) => {
    const { volume } = req.body;
    const { questionId } = req.params;
    const { commentId } = req.params;

    try {
      if (volume < -1 || volume > 1 || volume === 0) {
        return res.json({ message: 'Error volume' });
      }

      const question = await Question.findById(questionId);
      const comment = await Comment.findById(commentId);

      const checkRate = await Rate.findOne(
        commentId
          ? { rateFrom: req.user.userId, ratedComment: commentId }
          : {
              rateFrom: req.user.userId,
              ratedQuestion: questionId,
            }
      );

      if (!checkRate) {
        if (!commentId) {
          await Rate.create({
            rateFrom: req.user.userId,
            rateTo: question.user,
            volume,
            ratedQuestion: question._id,
          });
          return res.json({ message: 'Рейтинг успешно изменён' });
        }
        await Rate.create({
          rateFrom: req.user.userId,
          rateTo: comment.author,
          volume,
          ratedComment: comment._id,
        });
        return res.json({ message: 'Рейтинг успешно изменён' });
      }
      if (checkRate.volume !== volume) {
        if (!commentId) {
          await Question.findByIdAndUpdate(questionId, {
            questionRateCount: question.questionRateCount + volume,
          });
          await Rate.findOneAndUpdate(
            {
              rateFrom: req.user.userId,
              ratedQuestion: questionId,
            },
            { volume }
          );
          return res.json({ message: 'Рейтинг успешно изменён' });
        }
        await Comment.findByIdAndUpdate(commentId, {
          commentRateCount: comment.commentRateCount + volume,
        });
        await Rate.findOneAndUpdate(
          {
            rateFrom: req.user.userId,
            ratedComment: commentId,
          },
          { volume }
        );
        return res.json({ message: 'Рейтинг успешно изменён' });
      }
      return res.json({ message: 'Рейтинг уже изменён' });
    } catch (error) {
      return res.status(400).json({
        error: error.toString(),
      });
    }
  },
  deleteRate: async (req, res) => {
    const { questionId } = req.params;
    const { commentId } = req.params;

    try {
      const question = await Question.findById(questionId);
      const comment = await Comment.findById(commentId);

      const checkRate = await Rate.findOne(
        commentId
          ? { rateFrom: req.user.userId, ratedComment: commentId }
          : {
              rateFrom: req.user.userId,
              ratedQuestion: questionId,
            }
      );
      if (checkRate.volume !== 0) {
        if (!commentId) {
          await Question.findByIdAndUpdate(questionId, {
            questionRateCount: question.questionRateCount - checkRate.volume,
          });
          await Rate.findByIdAndUpdate(checkRate._id, { volume: 0 });
          return res.json({ message: 'Оценка удалена' });
        }
        await Comment.findByIdAndUpdate(commentId, {
          commentRateCount: comment.commentRateCount - checkRate.volume,
        });
        await Rate.findByIdAndUpdate(checkRate._id, { volume: 0 });
        return res.json({ message: 'Оценка удалена' });
      }
      return res.json({ message: 'Оценка уже удалена' });
    } catch (error) {
      return res.status(400).json({
        error: error.toString(),
      });
    }
  },
};
