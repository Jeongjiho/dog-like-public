const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { translate, koTranslateEn, enTranslateKo } = require('../../common');

const configuration = new Configuration({
    apiKey: '....',
});
const openai = new OpenAIApi(configuration);

router.get('/test', async (req, res, next) => {
    const resultText = await translate('안녕?', 'ko', 'en');
    res.json({result: resultText});
});

router.post('/', async (req, res, next) => {

    try {

        const { msg } = req.body;

        const enMsg = await koTranslateEn(msg);

        if(!enMsg) {
            res.json({'result': '에러가 발생했습니다.'});
        }

        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: enMsg,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const koResult = await enTranslateKo(completion.data.choices[0].text);

        res.json({'result': koResult});

    }
    catch (e) {
        //console.log(e);
        console.log(JSON.stringify(e, null, 2))
        res.json({'result': e});
    }

});

router.post('/image', async (req, res, next) => {

    try {

        const { msg } = req.body;

        const enMsg = await koTranslateEn(msg);

        const response = await openai.createImage({
            prompt: enMsg,
            n: 1,
            size: "1024x1024"
        });

        res.json({'result': response.data.data});

    }
    catch (e) {
        //console.log(e);
        console.log(JSON.stringify(e, null, 2))
        res.json({'result': e})
    }

});

router.get('/image', async (req, res, next) => {

    try {

        //const file = await fs.createReadStream('/Users/jeongjiho/Workspace/cafe24app/routes/chats/test.jpg');
        const file = fs.createReadStream(path.join(__dirname, 'test.png'));

        //const { msg } = req.query;
        const response = await openai.createImageVariation(
            file,
            1,
            "1024x1024"
        );

        res.redirect(response.data.data[0].url);

    }
    catch (e) {
        console.log(e);
        res.json({'result': e})
    }

});

router.get('/drawing', async (req, res, next) => {
    res.render('chats/drawing');
});

module.exports = router;
