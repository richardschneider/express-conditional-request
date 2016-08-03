'use strict';

let request = require("supertest"),
    server = require('./server');

require('should');

describe('Precondition', () => {

    describe('if-range', () => {

        it('should return 501 not implemented', done => {
            request(server())
                .get('/x/1')
                .set('if-range', '"1"')
                .expect(501)
                .end(done);
        });

    });

});
