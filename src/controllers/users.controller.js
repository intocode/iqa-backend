const jwt = require('jsonwebtoken');
const Question = require('../models/Question.model');
const User = require('../models/User.model');
const { catchError } = require('../utils/catchError');

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

module.exports.usersController = {
  authUser: async (req, res) => {
    try {
      let candidate = await User.findOne({ githubId: req.user.id });

      if (!candidate) {
        candidate = await User.create({
          name: req.user.username,
          fullName: req.user._json.name,
          company: req.user._json.company,
          githubBio: req.user._json.bio,
          githubId: req.user.id,
          avatarUrl: req.user._json.avatar_url,
          email: req.user.emails[0].value,
        });
      }

      const token = jwt.sign(
        {
          userId: candidate._id,
        },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.send(`
        <!doctype html>
        <html lang='en'>
          <head>
            <title>waiting...</title>
            
            <script>
              window.opener.postMessage({
                app: 'iqa',
                accessToken: '${token}'
              }, '*');
              window.close();
            </script>
          </head>
        </html>
      `);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },

  authFailure: (req, res) => {
    res.send(`
        <!doctype html>
        <html lang='en'>
          <head>
            <title>waiting...</title>
            
            <script>
              window.opener.postMessage({
                app: 'iqa',
                error: 'authorization failure'
              }, '*');
              window.close();
            </script>
          </head>
        </html>
      `);
  },

  getMyProfile: catchError(async (req, res) => {
    const profile = await User.findById(req.user.userId);

    const questionsThatUserFavorite = await Question.find(
      {
        usersThatFavoriteIt: profile._id,
      },
      {
        _id: 1,
      }
    );

    const questionIdsThatUserFavorite = questionsThatUserFavorite.map((question) => question._id);

    return res.json({ ...profile.toJSON(), questionIdsThatUserFavorite });
  }),

  userCheck: async (req, res) => {
    res.json(`hello ${req.user.name}`);
  },

  patchUserFullName: async (req, res) => {
    try {
      const fullName = await User.findByIdAndUpdate(
        req.params.id,
        {
          fullName: req.body.fullName,
          email: req.body.email,
        },
        { new: true }
      );
      res.json(fullName);
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
  },
};
