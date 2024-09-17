const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
let http = require('http');
let favicon = require('serve-favicon');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const wsModule = require('ws');


const app = express();
const env = process.env.NODE_ENV || 'development';

const { catsRouter, dogsRouter, filesRouter, chatsRouter, talkRouter, testRouter } = require('./routes');
const support = require('./support');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon', 'favicon.ico')))

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: false
}));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'resources')));

// dotenv
dotenv.config({ path: path.join(__dirname, `env/.env.${env}`) })

app.use('/', support);
app.use('/files', filesRouter);
app.use('/dogs', dogsRouter);
app.use('/cats', catsRouter);
app.use('/chats', chatsRouter);
app.use('/test', testRouter);

app.get('/', (req, res, next) => {
    res.redirect('/dogs/');
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = err;
    res.status(err.status || 500);
    res.render('error/error');
});

const server = http.createServer(app);
server.listen('8001');

const socketServer = new wsModule.WebSocketServer({
    server: server,
    //port: 8002
});

socketServer.on('connection', (ws, request) => {

    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;

    console.log('새로운 클라이언트 접속', ip);
    ws.on('message', (message) => { // 클라이언트로부터 메시지 수신 시
        console.log(message);
    });
    ws.on('error', (err) => { // 에러 발생 시
        console.error(err);
    });
    ws.on('close', () => { // 연결 종료 시
        console.log('클라이언트 접속 해제', ip);
        clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
        }
    }, 3000);

});

module.exports = app;
