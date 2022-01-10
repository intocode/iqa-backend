const { Router } = require('express');
const { usersController } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/profile', authMiddleware, usersController.getMyProfile);
router.get('/favorites', authMiddleware,usersController.getFavoritesByUser);
router.post(
  '/favorites/:id',
  authMiddleware,
  usersController.addQuestionToFavorites
);
router.delete(
  '/favorites/:id',
  authMiddleware,
  usersController.deleteQuestionInFavorites
);

module.exports = router;
