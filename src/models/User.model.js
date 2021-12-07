const mongoose = require('mongoose');
const { model } = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    githubId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('avatar').get(function getAvatar() {
  // console.log(this);
  return {
    thumbnail: `${process.env.SITE_URL}/static/small/${this.githubId}.jpg`,
    full: `${process.env.SITE_URL}/static/${this.githubId}.jpg`,
  };
});

const User = model('User', userSchema);

module.exports = User;
