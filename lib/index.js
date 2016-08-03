'use strict';

const allPreconditions = require('./preconditions');

function error(status, message, req, res) {
    res.status(status);
    if (message)
        res.send({ message: message});
    res.end();
}

function check(req, state, preconditions) {
    let failed = preconditions
        .map(p => p.check(req, state, req.get(p.header)))
        .find(status => status != 200);

    return failed || 200;
}

function process(req, res, next, options) {
    let preconditions = allPreconditions
        .filter(p => typeof req.get(p.header) !== "undefined");

    if (options.requiredWith.indexOf(req.method) >= 0 && preconditions.length === 0)
        return options.error(428, 'The request must be conditional; try using "If-Match"', req, res);

    if (preconditions.length === 0)
        return next();

    options
        .stateAsync(req)
        .then(state => check(req, state, preconditions))
        .then(status => {
            if (status != 200)
                return options.error(status, 'A requested precondition failed', req, res);
            next();
        })
        .catch(e => {
            console.log(e);
            options.error(500, e.message, req, res);
        });
 }

module.exports = function conditionalRequest(options) {
    options = options || {};
    options.error = options.error || error;
    options.requiredWith = options.requiredWith || ['PUT', 'PATCH', 'DELETE'];
    options.stateAsync = options.stateAsync || require('./resourceState');

    return (req, res, next) => process(req, res, next, options);
};
