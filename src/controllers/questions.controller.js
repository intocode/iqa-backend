const { validationResult } = require('express-validator');
const Question = require('../models/Question.model');

module.exports.questionsController = {
  addQuestion: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error', errors });
      }

      const question = await Question.create({
        question: req.body.question,
        comment: req.body.comment,
        tags: req.body.tags,
        user: req.user.userId,
      });

      return res.json({ message: 'Question created', question });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getAllQuestions: async (req, res) => {
    try {
      const allQuestions = await Question.find()
        .populate('tags', { _id: 0, name: 1, color: 1 })
        .populate('user', { name: 1, avatarURL: 1 });

      return res.json(allQuestions);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
};
