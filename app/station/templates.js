const hbs = require("koa-hbs");

const app = require('../../app');

app.use(hbs.middleware({
    viewPath: `${__dirname}/../views/pages`,
    layoutsPath: `${__dirname}/../views/layouts`,
    partialsPath: `${__dirname}/../views/partials`,
    defaultLayout: "default"
}));