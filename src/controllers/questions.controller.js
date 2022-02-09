const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
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

      if (req.headers.authorization) {
        const { authorization } = req.headers;
        const [type, token] = authorization.split(' ');

        if (type !== 'Bearer') {
          throw new Error("wrong token's type");
        }

        const authUser = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(authUser.userId);

        if (user.isAdmin) {
          const allQuestions = await Question.find()
            .populate('tags', { _id: 0, name: 1, color: 1 })
            .populate('user', { name: 1, githubId: 1, avatarUrl: 1 }); // fix avatarUrl: 1

          return res.json(allQuestions);
        }
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
};
