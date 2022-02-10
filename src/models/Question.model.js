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
    rates: [rateSchema],
  },
  { timestamps: true }
);

questionSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'questionId',
  justOne: false,
});

const Question = model('Question', questionSchema);

module.exports = Question;
