const { Router } = require('express');
const { check } = require('express-validator');
const { tagsController } = require('../controllers/tags.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, tagsController.getTags);

router.post(
  '/',
  authMiddleware,
  [
    check('name', 'Длина текста должна быть от 2 до 15 символов').isLength({
      min: 1,
      max: 15,
    }),
  ],
  tagsController.addTag
);

module.exports = router;