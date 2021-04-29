let express = require('express');
let asyncHandler = require('express-async-handler');
let _ = require('lodash');
let modsService = require('../services/mods');
let router = express.Router();

router.get('/', asyncHandler(async(req, res) => {
    let list = await modsService.getModList();
    const page = _.get(req.query, 'page', 1);
    const query = req.query.q;
    if (query !== undefined) {
        list = list.filter(mod => mod.name.toLowerCase().includes(query.toLowerCase()));
    }
    return res
        .header('X-Total-Count', list.length)
        .json(list.slice((page - 1) * 20, page * 20));
}));

module.exports = router;
