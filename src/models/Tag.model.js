const { Schema, model } = require('mongoose');

const tagSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    color: {
      type: String,
      default: 'primary',
    },
  },
  { timestamps: true }
);

const Tag = model('Tag', tagSchema);

module.exports = Tag;
