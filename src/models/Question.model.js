const { Schema, model } = require('mongoose');

const questionSchema = Schema(
  {
    question: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    questionRateCount: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

questionSchema.index({ question: 'text' });

const Question = model('Question', questionSchema);

module.exports = Question;
