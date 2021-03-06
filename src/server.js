const mongoose = require('mongoose');
const app = require('./app');

const { PORT, MONGO_SERVER } = process.env;

const connectAndStartServer = async () => {
  try {
    await mongoose.connect(MONGO_SERVER);

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Успешно соединились. Порт ${PORT}`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`Ошибка при подключении: ${e.toString()}`);
  }
};

connectAndStartServer();
