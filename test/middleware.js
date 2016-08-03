'use strict';

const middleware = require('../lib');

require('should');

describe('Middleware', () => {

    it('should return a function that takes (req, res, next)', () => {
        middleware().should.have.property('length', 3);
    });

    it ('should allow options', () => {
        middleware.should.have.property('length', 1);
    });

});
