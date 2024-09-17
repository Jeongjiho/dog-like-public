const express = require('express');
const fs = require("fs");
const path = require("path");
const dayjs = require('dayjs');
const router = express.Router();

router.get('/robots.txt', (req, res, next) => {

    const d = dayjs();
    console.log(`collect robots.txt :: ${d.format('YYYY-MM-DD HH:mm:ss')}`);

    fs.readFile(path.join(__dirname, "robots.txt"), "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        res.end(data) // Send Data
    });
});

router.get('/sitemap.xml', (req, res, next) => {

    const d = dayjs();
    console.log(`collect sitemap.xml :: ${d.format('YYYY-MM-DD HH:mm:ss')}`);

    fs.readFile(path.join(__dirname, "sitemap.xml"), "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        res.end(data) // Send Data
    });
});

router.get('/rss', (req, res, next) => {

    const d = dayjs();
    console.log(`collect rss.xml :: ${d.format('YYYY-MM-DD HH:mm:ss')}`);

    fs.readFile(path.join(__dirname, "rss"), "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return
        }
        res.end(data) // Send Data
    });
});

module.exports = router;
