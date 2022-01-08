const Comment = require('../models/Comment.model');

module.exports.commentsController = {
  addCommentToPost: async (req, res) => {
    try {
      const comm = await Comment.create({
        text: req.body.text,
        authorId: req.user.userId,
        questionId: req.params.questionId,
      });
      return res.json(comm);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
};
