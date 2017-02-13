const app = require('../../app');

/**
 * Patch body message if mongoose errors has been occurred
 * @param body - response body
 * @param err - error that is happened
 * @private
 */
function _mongooseErrors(body,err) {
    if(err.errors && Object.keys(err.errors).length) {
        body.mongooseValidationErrors = Object.keys(err.errors).map((key)=>{
            let error = err.errors[key];
            return `${key} : ${error.message}`;
        }).join(';');
    }
}

// Error propagation.
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        err.status = err.status || 500;
        err.message = err.message || 'Something went wrong!';
        this.status = err.status;
        this.body = {success: false, code: err.code || err.status, message: err.message};
        _mongooseErrors(this.body,err)
        this.app.emit('error', err, this);
    }
});

// 404 handling.
app.use(function *(next) {
    yield next;
    var body = this.body;
    var status = this.status || 404;
    var noContent = ~[204, 205, 304].indexOf(status);

    // ignore body
    if (noContent) return;

    // status body
    if (null == body) {
        this.throw(status);
    }
});

