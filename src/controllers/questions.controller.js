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
        .populate('tags', { _id: 1, name: 1, color: 1 })
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
          .populate('tags', { _id: 1, name: 1, color: 1 })
          .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

        return res.json(question);
      }

      const { search } = req.query;

      if (search) {
        const question = await Question.find({ $text: { $search: search } });
        return res.json(question);
      }

      let { offset, limit } = req.query;

      if (!offset || offset < 0) {
        offset = 0;
      }

      if (!limit) {
        limit = 20;
      }

      const maxLimit = Number(process.env.QUESTION_PAGINATION_LIMIT);

      if (limit > maxLimit) {
        limit = maxLimit;
      }

      const limitedQuestions = await Question.find({ deleted: { $ne: true } })
        .populate('tags', { _id: 1, name: 1, color: 1 })
        .populate('user', { name: 1, githubId: 1, avatarUrl: 1 }) // fix avatarUrl: 1
        .limit(Number(limit))
        .skip(offset);

      const allQuestions = await Question.countDocuments({
        deleted: { $ne: true },
      });

      return res.json({ total: allQuestions, items: limitedQuestions });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getQuestionsByTag: async (req, res) => {
    try {
      const { tagId } = req.params;

      const questions = await Question.find({
        tags: tagId,
        deleted: { $ne: true },
      })
        .populate('tags', { _id: 1, name: 1, color: 1 })
        .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

      return res.json(questions);
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

      return res.json({ error: 'У вас недостаточно прав' });
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

      return res.json({ error: 'У вас недостаточно прав' });
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
          .populate('tags', { _id: 1, name: 1, color: 1 })
          .populate('user', { name: 1, githubId: 1, avatarUrl: 1 });

        return res.json(questions);
      }

      return res.json({ error: 'У вас недостаточно прав' });
    } catch (e) {
      return res.status(401).json({ error: e.toString() });
    }
  },
};
