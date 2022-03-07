require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question.model');
const Comment = require('../models/Comment.model');

const { MONGO_SERVER } = process.env;

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_SERVER);

    const questions = await Question.find();

    questions.forEach(async (question) => {
      const comments = await Comment.find({ questionId: question._id }).count();
      await Question.findByIdAndUpdate(question._id, {
        commentsCount: comments,
      });
    });

    // eslint-disable-next-line no-console
    console.log('Ключи обновлены');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Ошибка при подключении: ${e.toString()}`);
  }
};

connectToMongo();
