'use strict';

let request = require("supertest"),
    server = require('./server');

require('should');

describe('Options', () => {

    let something = "some text";

    describe('require', () => {

        it('should return 428 when precondition is missing and method is unsafe', done => {
            request(server())
                .post('/1')
                .send(something)
                .expect(428)
                .end(done);
        });

        it('should continue when method is safe', done => {
            request(server())
                .get('/1')
                .expect(404)
                .end(done);
        });

        it('should continue when false', done => {
            request(server({require: false}))
                .post('/1')
                .send(something)
                .expect(201)
                .end(done);
        });
    });

});
