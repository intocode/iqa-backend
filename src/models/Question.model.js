const { Schema, model } = require('mongoose');

const rateSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
    },
    volume: {
      type: Number,
      enum: [-1, 1],
    },
  },
  { timestamps: true }
);

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
    totalComments: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    rates: [rateSchema],
  },
  { timestamps: true }
);

const Question = model('Question', questionSchema);

module.exports = Question;
