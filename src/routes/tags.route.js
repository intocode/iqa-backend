const { Router } = require('express');
const { check } = require('express-validator');
const { tagsController } = require('../controllers/tags.controller.js');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', tagsController.getTags);
router.post(
  '/',
  authMiddleware,
  [
    check(
      'name',
      'Длина текста должна быть больше 1 и меньше 15 символов'
    ).isLength({ min: 1, max: 15 }),
  ],
  tagsController.addTag
);

module.exports = router;
