const { validationResult } = require('express-validator');
const Tag = require('../models/Tag.model');

module.exports.tagsController = {
  addTag: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error', errors });
      }

      const tag = await Tag.create({
        name: req.body.name,
        color: req.body.color,
      });

      return res.json({ message: 'Tag created', tag });
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
  getTags: async (req, res) => {
    try {
      const query = new RegExp(req.query.q, 'i');
      const tags = await Tag.find({ name: { $regex: query } });

      return res.json(tags);
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }
  },
};
