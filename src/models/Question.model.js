const { Schema, model } = require('mongoose');

const questionSchema = Schema(
  {
    // Заголовок
    question: {
      type: String,
      required: true,
    },

    // полное описание вопроса
    fullDescription: {
      type: String,
    },

    // массив из тегов
    tags: [{ type: String }],

    // автор публикации
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // количество комментов к посту, связан с Comments
    commentsCount: {
      type: Number,
      default: 0,
    },

    // удален данный вопрос или нет
    deleted: {
      type: Boolean,
      default: false,
    },

    // у кого данный вопрос в избранных
    usersThatFavoriteIt: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

questionSchema.index({ question: 'text' });

const Question = model('Question', questionSchema);

module.exports = Question;
