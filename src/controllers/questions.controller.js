const { validationResult } = require('express-validator');
const Question = require('../models/Question.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

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

      const allQuestions = await Question.find()
        .populate('tags', { _id: 0, name: 1, color: 1 })
        .populate('user', { name: 1, githubId: 1, avatarUrl: 1 }) // fix avatarUrl: 1
        .populate('totalComments');

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
        await Question.findByIdAndRemove(id);
        const allQuestions = await Question.find();

        return res.json(allQuestions);
      }

      return res.json({ error: 'У вас недостаточно прав' });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
};
