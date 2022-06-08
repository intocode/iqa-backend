const Question = require('../models/Question.model');

module.exports.ratesController = {
  setRate: async (req, res) => {
    const { volume } = req.body;
    const { questionId } = req.params;

    try {
      const question = await Question.findById(questionId);

      if (!question) {
        return res.status(404).json({
          error: 'Вопрос с таким ID не найден',
        });
      }

      let updated = false;
      question.rates.forEach((rate, index) => {
        if (rate.user.toString() === req.user.userId) {
          if (rate.volume !== volume) {
            // eslint-disable-next-line no-param-reassign
            rate.volume = volume;
          } else {
            question.rates.splice(index, 1);
          }

          updated = true;
        }
      });

      if (!updated) {
        question.rates.push({
          user: req.user.userId,
          volume,
        });
      }

      await question.save();

      return res.json(question.rates);
    } catch (e) {
      return res.status(401).json({
        error: e.toString(),
      });
    }
  },
};
