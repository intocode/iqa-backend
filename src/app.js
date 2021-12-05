require('dotenv').config();
require('./config/passport');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use('/static', express.static(`${__dirname}/../static`));

app.use(require('./routes'));

module.exports = app;
