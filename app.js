"use strict";

const koa = require('koa');
const app = koa();

module.exports = app;

require('./app/libs/mongoose');

require('./app/bootstrap');

require('./app/station/statics');
require('./app/station/templates');
require('./app/station/parsers');
require('./app/station/session');
require('./app/station/errors');
require('./app/routes');

