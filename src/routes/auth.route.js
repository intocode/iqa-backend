const { Router } = require('express');
const passport = require('passport');
const { usersController } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/check', authMiddleware, usersController.userCheck);

router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/github/failure',
  }),
  usersController.authUser
);

router.get('/github/failure', usersController.authFailure);

router.get('/logout', (req, res) => {
  req.logOut();
  res.status(200).json('you are logged out');
});

module.exports = router;
