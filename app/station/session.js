const app = require('../../app');

const session = require('koa-generic-session');
const MongooseStore = require('koa-session-mongoose');

app.use(session({
    store: new MongooseStore()
}));

