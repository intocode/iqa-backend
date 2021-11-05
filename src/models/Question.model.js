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
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Question = model('Question', questionSchema);

module.exports = Question;
