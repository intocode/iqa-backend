const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = process.env;

module.exports.usersController = {
  authUser: async (req, res) => {
    try {
      let candidate = await User.findOne({ githubId: req.user.id });

      if (!candidate) {
        candidate = await User.create({
          name: req.user.username,
          githubId: req.user.id,
          email: req.user.emails[0].value,
          avatarURL: req.user._json.avatar_url,
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
};
