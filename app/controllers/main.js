"use strict";

const config = require("../config.json");
const Router = require('koa-router');
const routes = new Router();
const rp = require('request-promise');
const urlHelper = require('../libs/urlHelper');

const Url = require('../models/url').Url;

module.exports.routes = function () {
    routes.get('/', this.index);
    routes.get('/:shortening', this.redirect);
    routes.post('/', this.shortenIt);

    return routes.middleware();
};

module.exports.index = function* () {
    yield this.render("index", {title: 'URL SHRTNR'});
};

module.exports.shortenIt = function* () {
    var response = yield rp({uri:this.request.body.actualLink, resolveWithFullResponse: true});
    if(response.statusCode===301) return this.body = {success:false,message:'You cannot setup short link for redirect.'};
    if(response.statusCode!==200) return this.body = {success:false,message:'Something wrong with your link.'};
    // Check shortening duplications
    if(this.request.body.desiredShorten) {
        const urlRecord = yield urlHelper.checkShortening(this.request.body.desiredShorten);
        if(urlRecord) return this.body = {success:false,message:'There is shorten link with same shortening. Please change it and try again.'};
    }
    // Build new url record
    const urlRecord = new Url({
        url: this.request.body.actualLink,
        shortening: this.request.body.desiredShorten || Url.generateShorten()
    });
    yield urlRecord.save();
    this.body = {success:true, url: urlRecord};
};

module.exports.redirect = function* () {
    const urlRecord = yield Url.findOne({shortening:this.params.shortening});
    if(!urlRecord) return yield this.render("404", {title: 'URL SHRTNR 404'});
    this.redirect(urlRecord.url);
}


