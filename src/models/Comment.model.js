const { Schema, model } = require('mongoose');
const Question = require('./Question.model');

const commentSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },

    author: {
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

commentSchema.pre('save', async function updateCommentsCounter(next) {
  await Question.findByIdAndUpdate(this.questionId.toString(), {
    $inc: { commentsCount: 1 },
  });
  next();
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
