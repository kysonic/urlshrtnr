const config = require('./config.json');
const app = require("../app");

app.keys = ['urlshtnr0.01723630391630593'];
app.proxy = config.trust_proxy || false;
app.poweredBy = false;
app.name = config.sitename;
app.context.port = config.port || 3000;





