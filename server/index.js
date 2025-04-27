// === IMPORTS ===
const fs = require('fs');
const path = require('path');

const express = require('express');
const cors = require('cors');

const webpack = require('webpack');
const webpackConfigFactory = require('../webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');


// === CONSTS ===
const PORT = 4343;

const PRIVATE_KEY = fs.readFileSync( path.resolve(__dirname, '../ssl/private.key') );
const CERTIFICATE = fs.readFileSync( path.resolve(__dirname, '../ssl/certificate.crt') );


// === EXEC CODE ===
const app = express();
const webpackConfig = webpackConfigFactory({}, { mode: 'development' });
const compiler = webpack(webpackConfig);


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
}));

// app.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-store');
//     next();
// });

app.use( webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    writeToDisk: true, // Запись на диск
    stats: 'minimal',
}) );
app.use( webpackHotMiddleware(compiler, {
    log: false, // Отключение лишних логов
    heartbeat: 2000, // Интервал обновлений для HMR
}) );


const server = require('https').createServer({
    key: PRIVATE_KEY,
    cert: CERTIFICATE,  
}, app);

require('./socket.js')(server);


server.listen(PORT, "0.0.0.0", _ => console.log(
    `Server running on ${process.env.SIGNAL??'https://vde0.chat'}${process.env.SIGNAL?'':':'+PORT}`
));