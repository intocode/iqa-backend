const { Router } = require('express');
const { addLikeController, removeLikeController } = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router({ mergeParams: true });

router.post('/', authMiddleware, addLikeController);
router.delete('/', authMiddleware, removeLikeController);

module.exports = router;
