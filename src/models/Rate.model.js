const mongoose = require('mongoose');

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

const Rate = mongoose.model('Rate', rateSchema);

module.exports = Rate;
