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
    avatarUrl: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('avatar').get(function getAvatar() {
  return {
    thumbnail: `${this.avatarUrl}&s=40`,
    full: this.avatarUrl,
  };
});

const User = model('User', userSchema);

module.exports = User;
