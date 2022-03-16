const mongoose = require('mongoose');

const rateSchema = mongoose.Schema(
  {
    rateFrom: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rateTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    volume: {
      type: Number,
      required: true,
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
