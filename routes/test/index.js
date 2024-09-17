const express = require('express');
const requestIp = require('request-ip');
const shell = require('shelljs');
const router = express.Router();

router.post('/', async (req, res, next) => {

    const ip = requestIp.getClientIp(req);
    if('.....' != ip && '::ffff:127.0.0.1' != ip) {
        return res.status(401).end();
    }

    const { exec } = req.body;

    /*const result = shell.exec(exec).split('\n').filter(txt => txt);
    return res.status(200).send(result);*/

    return res.status(200).end();

});


module.exports = router;
