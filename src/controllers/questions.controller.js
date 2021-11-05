const Question = require('../models/Question.model');

module.exports.questionsController = {
  addQuestion: async (req, res) => {
    try {
      const question = await Question.create({
        question: req.body.question,
        comment: req.body.comment,
        user: req.user.userId,
      });

      res.json({ message: 'Question created', question });
    } catch (e) {
      res.json({ error: e.toString() });
    }
  },
};
