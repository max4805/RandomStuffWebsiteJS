const express = require('express');
const path = require('path');
const logger = require('morgan');
const history = require('connect-history-api-fallback');

let assetsRouter = require('./routes/assets');

let app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(history());
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/assets', assetsRouter);

module.exports = app;
