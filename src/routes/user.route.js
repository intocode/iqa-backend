const { Router } = require('express');
const { usersController } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/profile', authMiddleware, usersController.getMyProfile);
router.post("/favorites/:id",authMiddleware, usersController.addQuestionInFavorites);

module.exports = router;
