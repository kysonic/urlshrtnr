var bodyParser = require('koa-body');

const app = require('../../app');

app.use(bodyParser({formidable:{uploadDir: __dirname}}));
