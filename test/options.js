'use strict';

let request = require("supertest"),
    server = require('./server');

require('should');

describe('Options', () => {

    let something = "some text";

    describe('requiredWith', () => {

        it('should return 428 when precondition is missing and method requires a precondition', done => {
            request(server())
                .put('/1')
                .send(something)
                .expect(428)
                .end(done);
        });

        it('should allow setting of methods that require a precondition', done => {
            request(server({ requiredWith: ['GET']}))
                .get('/1')
                .expect(428)
                .end(done);
        });

        it('should continue when precondition is missing and method does not require a precondition', done => {
            request(server())
                .get('/1')
                .expect(404)
                .end(done);
        });

        it('should continue when precondition is satisfied', done => {
            request(server())
                .post('/1')
                .set('If-None-Match', 1)
                .send(something)
                .expect(201)
                .end(done);
        });

    });

});
