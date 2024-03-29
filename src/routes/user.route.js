const { Router } = require('express');
const { usersController } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/profile', authMiddleware, usersController.getMyProfile);
router.patch('/profile/:id', usersController.updateProfile);

module.exports = router;
