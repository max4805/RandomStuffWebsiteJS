const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const logger = require('morgan');
const history = require('connect-history-api-fallback');

let assetsRouter = require('./routes/assets');
let modsRouter = require('./routes/mods');
let wipesRouter = require('./routes/wipes');

let app = express();

app.use(fileUpload());

if (process.env.NODE_ENV === 'production') {
    app.use(history());
}
else {
    app.use((_, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.header('Access-Control-Expose-Headers', 'X-Total-Count');
        next();
    })
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/assets', assetsRouter);
app.use('/api/mods', modsRouter);
app.use('/api/wipes', wipesRouter);

module.exports = app;
