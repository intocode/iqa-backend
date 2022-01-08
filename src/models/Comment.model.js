const { Schema, model } = require('mongoose');

const commentSchema = Schema({
  text: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
  },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
