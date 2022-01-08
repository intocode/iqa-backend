const Comment = require('../models/Comment.model');
const Question = require('../models/Question.model');

module.exports.commentsController = {
  addCommentToPost: async (req, res) => {
    try {
      const { id } = req.params;

      const question = await Question.findById(id);

      if (!question) {
        return res.status(400).json({ error: 'такого вопроса не существует' });
      }

      const comment = await Comment.create({
        text: req.body.text,
        authorId: req.user.userId,
        questionId: id,
      });

      return res.json(comment);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getCommentsForQuestion: async (req, res) => {
    try {
      const { id } = req.params;

      const comments = await Comment.find({
        questionId: id,
      });

      return res.json(comments);
    } catch (e) {
      return res.status(400).json(e.toString());
    }
  },
};
