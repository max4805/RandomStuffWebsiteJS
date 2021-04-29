let express = require('express');
let asyncHandler = require('express-async-handler');
let assetService = require('../services/assets');
let router = express.Router();
let fs = require('fs');

router.get('/download', asyncHandler(async(req, res) => {
    if (req.query.path === undefined) {
        return res.status(400).json({ error: 'The "path" query param is mandatory!' });
    }
    const result = await assetService.downloadAssetByPath(req.query.path);
    if (result === null) {
        return res.status(404).json({ error: `File ${req.query.path} was not found!` });
    }
    res.contentType('image/png');
    result.pipe(res);
    return res;
}));

router.post('/package', asyncHandler(async(req, res) => {
    if (req.body.baseDirectory === undefined || req.body.files === undefined) {
        return res.status(400).json({ error: 'The "baseDirectory" and "files" parameters are mandatory!' });
    }
    if (!req.body.baseDirectory.match(/^[A-Za-z0-9/]+$/)) {
        return res.status(400).json({ error: 'The "baseDirectory" field should be alphanumeric!' });
    }
    const result = await assetService.packageAssets(req.body.baseDirectory, req.body.files);
    if (result === null) {
        return res.status(404).json({ error: 'None of the given files was found!' });
    }
    return res.sendFile(result.file, {}, () => fs.rm(result.directory, { recursive: true }, err => {
        if (err) {
            console.error('Failed to delete temp file!');
            console.error(err);
        }
    }));
}));

// get assets in a category
router.get('/:category', asyncHandler(async(req, res) => {
    const result = await assetService.getAssetCategoryContents(req.params.category);
    if (result === null) {
        return res.status(404).json({ error: `Category ${req.params.category} was not found!` });
    }
    return res.json(result);
}));

module.exports = router;
