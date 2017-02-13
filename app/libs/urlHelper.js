const Url = require('../models/url').Url;

module.exports.checkShortening = function*(shortening){
    return Url.findOne({shortening:shortening});
}