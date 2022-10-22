require('dotenv').config();

const express = require('express');

const app = express();
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');
const { DB_ADDRESS } = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

app.use(express.json());

mongoose.connect(DB_ADDRESS);

app.use(cors());
app.options('*', cors());

app.use(helmet());
app.use(limiter);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
