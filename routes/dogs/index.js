const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.render('dogs/index');
});

module.exports = router;
