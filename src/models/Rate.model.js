const mongoose = require('mongoose');
const Question = require('./Question.model');
const Comment = require('./Comment.model');

const rateSchema = mongoose.Schema(
  {
    rateFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rateTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    volume: {
      type: Number,
      enum: [-1, 1],
    },
    ratedQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    },
    ratedComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

// eslint-disable-next-line func-names
rateSchema.pre('save', async function (next) {
  await Question.findByIdAndUpdate(this.ratedQuestion.toString(), {
    questionRateCount: +this.volume,
  });
  next();
});

// eslint-disable-next-line func-names
rateSchema.pre('save', async function (next) {
  await Comment.findByIdAndUpdate(this.ratedComment.toString(), {
    commentRateCount: +this.volume,
  });
  next();
});

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
