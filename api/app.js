let express = require('express');
let path = require('path');
let logger = require('morgan');

let assetsRouter = require('./routes/assets');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/assets', assetsRouter);

module.exports = app;
