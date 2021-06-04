let express = require('express');
let asyncHandler = require('express-async-handler');
const fsPromises = require('fs/promises');
let _ = require('lodash');
let router = express.Router();

let wipeService = require('../services/wipes');

router.post('/', asyncHandler(async(req, res) => {
    if (_.isNil(req.files) || _.isNil(req.files.wipe)) {
        return res.status(400).json({ error: 'Wipe parameter is missing' });
    }

    const filePath = `/tmp/wipe_${Date.now()}.png`;
    await req.files.wipe.mv(filePath);
    const response = await wipeService.convertWipeToTriangles(filePath);
    await fsPromises.rm(filePath);

    if (_.isNil(response)) {
        return res.status(400).json({ error: 'The given image could not be read' });
    }
    return res.json(response);
}));

module.exports = router;
