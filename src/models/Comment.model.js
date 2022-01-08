const { Schema, model } = require('mongoose');

const commentSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);

module.exports = Comment;
