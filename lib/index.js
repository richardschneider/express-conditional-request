'use strict';

function defaults(options) {
    options = options || {};

    return options;
}

function process(options, req, res, next) {

}

module.exports = function conditionalRequest(options) {
    return (req, res, next) => process(req, res, next, defaults(options));
};
