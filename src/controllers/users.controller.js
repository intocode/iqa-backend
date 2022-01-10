const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Question = require('../models/Question.model');

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

module.exports.usersController = {
  authUser: async (req, res) => {
    try {
      let candidate = await User.findOne({ githubId: req.user.id });

      if (!candidate) {
        candidate = await User.create({
          name: req.user.username,
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
  getMyProfile: async (req, res) => {
    try {
      const profile = await User.findById(req.user.userId);

      return res.json(profile);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  userCheck: async (req, res) => {
    res.json(`hello ${req.user.name}`);
  },
  addQuestionInFavorites: async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);

      if (!question) {
        return res.status(400).json({
          message: 'Такого вопроса нет',
        });
      }
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          $addToSet: { favorites: req.params.id },
        },
        { new: true }
      );
      return res.json(user.favorites);
    } catch (e) {
      return res.json({
        message: `Ошибка при добавлении вопроса в избранные:${e.toString()}`,
      });
    }
  },
  deleteQuestionInFavorites: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user.userId,
        {
          $pull: { favorites: req.params.id },
        },
        { new: true }
      );
      res.json(user.favorites);
    } catch (e) {
      res.json({
        message: `Ошибка при добавлении вопроса в избранные:${e.toString()}`,
      });
    }
  },
  getFavoritesByUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId, { favorites: 1 });

      res.json(user);
    } catch (e) {
      res.json({
        message: `Ошибка при выводе избранных вопросов:${e.toString()}`,
      });
    }
  },
};
