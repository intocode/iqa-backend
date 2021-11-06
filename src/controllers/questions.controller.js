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
        user: req.user.userId,
      });

      return res.json({ message: 'Question created', question });
    } catch (e) {
      return res.json({ error: e.toString() });
    }
  },
};
