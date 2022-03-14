const { validationResult } = require('express-validator');
const Question = require('../models/Question.model');
const User = require('../models/User.model');

module.exports.questionsController = {
  addQuestion: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error', errors });
      }

      const createdQuestion = await Question.create({
        question: req.body.question,
        comment: req.body.comment,
        tags: req.body.tags,
        user: req.user.userId,
      });

      const question = await Question.findById(createdQuestion._id)
        .populate('tags', { _id: 0, name: 1, color: 1 })
        .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

      return res.json({ message: 'Question created', question });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getQuestions: async (req, res) => {
    try {
      const { id } = req.params;

      if (id) {
        const question = await Question.findById(id)
          .populate('tags', { _id: 0, name: 1, color: 1 })
          .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

        return res.json(question);
      }

      const { search } = req.query;

      if (search) {
        const question = await Question.find({ $text: { $search: search } });
        return res.json(question);
      }

      const allQuestions = await Question.find({ deleted: { $ne: true } })
        .populate('tags', { _id: 0, name: 1, color: 1 })
        .populate('user', { name: 1, githubId: 1, avatarUrl: 1 }); // fix avatarUrl: 1

      return res.json(allQuestions);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  removeQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const user = await User.findById(userId);

      if (user.isAdmin) {
        await Question.findByIdAndUpdate(id, { $set: { deleted: true } });

        return res.json({ message: 'Question deleted' });
      }

      return res.status(403).json({ error: 'У вас недостаточно прав' });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },

  restoreQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const user = await User.findById(userId);

      if (user.isAdmin) {
        await Question.findByIdAndUpdate(id, { $set: { deleted: 'false' } });

        return res.json({ message: 'Question restored' });
      }

      return res.status(403).json({ error: 'У вас недостаточно прав' });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getRemovedQuestions: async (req, res) => {
    try {
      const { userId } = req.user;

      const user = await User.findById(userId);

      if (user.isAdmin) {
        const questions = await Question.find({ deleted: true })
          .populate('tags', { _id: 0, name: 1, color: 1 })
          .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

        return res.json(questions);
      }

      return res.json({ error: 'У вас недостаточно прав' });
    } catch (e) {
      return res.status(401).json({ error: e.toString() });
    }
  },
  changeRate: async (req, res) => {
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
