'use strict';

const safeMethods = ['GET', 'HEAD', 'OPTIONS', 'TRACE'];

function safe(req, options) {
    return options.safeMethods.indexOf(req.method) >= 0;
}

function error(status, message, req, res) {
    res.status(status);
    if (message)
        res.send({ message: message});
    res.end();
}

function defaults(options) {
    options = options || {};
    options.error = options.error || error;
    options.require = (options.hasOwnProperty('require')) ? options.require : true;
    options.safeMethods = options.safeMethods || safeMethods;

    return options;
}

function process(req, res, next, options) {
    let preconditions = [];

    if (options.require && !safe(req, options) && preconditions.length === 0)
        return options.error(428, 'The request must be conditional; try using "If-Match"', req, res);

    next();
}

module.exports = function conditionalRequest(options) {
    return (req, res, next) => process(req, res, next, defaults(options));
};
