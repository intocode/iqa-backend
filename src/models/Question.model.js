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
  },
  { timestamps: true }
);

const Question = model('Question', questionSchema);

module.exports = Question;
