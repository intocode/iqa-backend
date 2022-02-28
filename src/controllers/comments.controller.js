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

      const createdComment = await Comment.create({
        text: req.body.text,
        author: req.user.userId,
        questionId: id,
      });

      await Comment.where({ questionId: id }).count();

      const comment = await Comment.findById(createdComment._id).populate(
        'author',
        { id: 1, name: 1, avatarUrl: 1 }
      );

      return res.json(comment);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getCommentsByQuestionId: async (req, res) => {
    try {
      const { id } = req.params;

      const comments = await Comment.find({
        questionId: id,
      }).populate('author', { id: 1, name: 1, avatarUrl: 1 });

      return res.json(comments);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
};
