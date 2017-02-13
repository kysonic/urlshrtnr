"use strict";

const app = require("../app");
const main = require("./controllers/main");

app.use(main.routes());
