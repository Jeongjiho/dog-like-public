const axios = require('axios');

const CONSTANT = {
    LANG: {
        KO: 'ko',
        EN: 'en'
    }
}
const translate = async (text, source, target) => {

    try {
        const api_url = '...';
        const client_id = '...';
        const client_secret = '...';


        const response = await axios.post(api_url, {
            'source': source,
            'target': target,
            'text': text
        }, {
            headers: {
                'X-Naver-Client-Id':client_id,
                'X-Naver-Client-Secret': client_secret
            }
        });

        const { status, data: {message: {result: {translatedText}}} } = response;

        if( status === 200 ) {
            return translatedText;
        }
        else {
            return;
        }

    }
    catch (e) {
        console.error(e);
        return;
    }

}

const koTranslateEn = async (text) => {
    return await translate(text, CONSTANT.LANG.KO, CONSTANT.LANG.EN);
}

const enTranslateKo = async (text) => {
    return await translate(text, CONSTANT.LANG.EN, CONSTANT.LANG.KO);
}

module.exports = {
    CONSTANT,
    translate,
    koTranslateEn,
    enTranslateKo
}
