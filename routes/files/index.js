const express = require('express');
const mysql = require("mysql");
const fs = require("fs");
const Base64BufferThumbnail = require("base64-buffer-thumbnail-no-cache");
const router = express.Router();

const option = {
    connectionLimit : 5,
    host     : 'doglike.cafe24app.com',
    user     : '......',
    password : '......',
    database : '.....'
};

const pool  = mysql.createPool(option);

const fileFilter = (mimetype) =>{

    const typeArray = mimetype.split('/');

    const fileType = typeArray[1]; // 이미지 확장자 추출

    if(fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png'){
        return true;
    }else {
        return false;
    }

}

const options = {percentage: 50, responseType: "base64"};

router.post('/upload', async (req, res, next) => {
    const { serviceType } = req.body;
    const { mimetype, data } = req.files.file;

    if(fileFilter(mimetype)) {
        const base64 = Buffer.from(data).toString('base64');
        const thumbnail = await Base64BufferThumbnail(base64, options);

        pool.getConnection(function(err, connection) {

            // not connected!
            if (err) {
                console.error(err);
            }

            // Use the connection
            connection.query('Insert Into dog_like_image (image, createDate, serviceType) VALUES (?, now(), ?)', [thumbnail, serviceType], function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if(error) {
                    console.error(error);
                }

                // Don't use the connection here, it has been returned to the pool.
            });
        });

    }
    else {
        console.log(`File Filter Not Support :: ${mimetype}`);
    }

    res.json({ok: true})
});

router.get('/image', async (req, res, next) => {

    await pool.getConnection( async function(err, connection) {

        // not connected!
        if (err) {
            console.error(err);
        }

        // Use the connection
        await connection.query('SELECT * FROM dog_like_image', [], function (error, results, fields) {
            console.log(results.length);
            for(const base64Image of results) {
                //console.log(base64Image.image)
                //const base64Data = base64Image.image.replace(/^data:image\/png;base64,/, "");
                fs.writeFile(`./images/${base64Image.id}.png`, base64Image.image.toString(), {encoding: 'base64'}, function(err) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log('file created');
                    }
                });
            }
        });
    });


    res.json({ok: true})
});

module.exports = router;
