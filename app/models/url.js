const mongoose = require('../libs/mongoose');

let UrlSchema = new mongoose.Schema({
    url: String,
    shortening: String,
    created: {type: Date, default: Date.now}
});


// Hooks
UrlSchema.pre('save', function (next) {
    if (!this.isNew) return next();
    if (!this.shortening) {
        let error = new Error('There is no shorten version of provided url');
        next(error);
    } else {
        next();
    }
});

UrlSchema.statics = {
    /**
     * Generate random short string
     */
    generateShorten: function () {
        return (Math.random()+1).toString(36).substring(20);
    }
};

var Url = mongoose.model('Url', UrlSchema);

// Validators
Url.schema.path('shortening').validate(function (link) {
    return link.trim().length && link.trim().length < 10;
}, 'Short version of your url cannot be empty and should be less than 10 symbols.');

exports.Url = Url;

