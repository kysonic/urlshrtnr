const path  = require('path');

const serve = require('koa-static');
const favicon = require('koa-favicon');
const compression = require('koa-compress');
const koaStylus = require('koa-stylus');
const stylus = require('stylus');

const app = require('../../app');

app.use(compression());

app.use(favicon(path.join(__dirname,'/../../public/favicon.ico')));

app.use(koaStylus({
    src: path.join(__dirname,'../../', 'app','views'),
    dest: path.join(__dirname,'../../', 'public'),
    compile: function compile(str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
    }
}));

app.use(serve(path.join(__dirname,'../../public'), {
    maxage: 1000 * 60 * 15,
    gzip: true
}));

