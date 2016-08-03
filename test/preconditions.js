'use strict';

let request = require("supertest");

require('should');

const oneDay = 86400000;

describe('Precondition', () => {

    var server, resourceUrl, resourceEtag, resourceLastModified;

    beforeEach(function (done) {
        server = require('./server')();
        request(server)
            .post('/something')
            .send("cruft")
            .expect(201)
            .expect(function (res) {
                resourceUrl = res.header['location'];
                resourceEtag = res.header['etag'];
                resourceLastModified = res.header['last-modified'];
            })
            .end(done);
    });


    describe('if-range', () => {

        it('should return 501 not implemented', done => {
            request(server)
                .get('/x')
                .set('if-range', '"1"')
                .expect(501)
                .end(done);
        });

    });

    describe('if-match', () => {

        it('should succeed when etag exists', done => {
            request(server)
                .put(resourceUrl)
                .set('if-match', resourceEtag)
                .expect(200)
                .end(done);
        });

       it('should succeed when any of the etags exist', done => {
            request(server)
                .put(resourceUrl)
                .set('if-match', ['"x"', '"y"', '"z"', resourceEtag])
                .expect(200)
                .end(done);
        });

       it('should succeed when any etag exists for resource', done => {
            request(server)
                .put(resourceUrl)
                .set('if-match', '*')
                .expect(200)
                .end(done);
        });

        it('should fail when etag does not exist', done => {
            request(server)
                .put(resourceUrl)
                .set('if-match', '"x"')
                .expect(412)
                .end(done);
        });

       it('should fail when none of the etags do not exist', done => {
            request(server)
                .put(resourceUrl)
                .set('if-match', ['"x"', '"y"', '"z"'])
                .expect(412)
                .end(done);
        });

       it('should fail when no etag exists for the resource', done => {
            request(server)
                .put('/something-else')
                .set('if-match', '*')
                .expect(412)
                .end(done);
        });

    });

    describe('if-none-match', () => {

        it('should succeed when etag does not exist', done => {
            request(server)
                .put(resourceUrl)
                .set('if-none-match', '"x"')
                .expect(200)
                .end(done);
        });

       it('should succeed when none of etags exist', done => {
            request(server)
                .put(resourceUrl)
                .set('if-none-match', ['"x"', '"y"', '"z"'])
                .expect(200)
                .end(done);
        });

       it('should succeed when no etag exists', done => {
            request(server)
                .post('/something-else')
                .set('if-none-match', '*')
                .expect(201)
                .end(done);
        });

        it('should fail when etag exists', done => {
            request(server)
                .put(resourceUrl)
                .set('if-none-match', resourceEtag)
                .expect(412)
                .end(done);
        });

       it('should fail when one of the etags exists', done => {
            request(server)
                .put(resourceUrl)
                .set('if-none-match', ['"x"', '"y"', '"z"', resourceEtag])
                .expect(412)
                .end(done);
        });

       it('should fail when any etag exists', done => {
            request(server)
                .put(resourceUrl)
                .set('if-none-match', '*')
                .expect(412)
                .end(done);
        });

        it('should return 304 when method is GET and etag exists', done => {
            request(server)
                .get(resourceUrl)
                .set('if-none-match', resourceEtag)
                .expect(304)
                .end(done);
        });

        it('should return 304 when method is HEAD and etag exists', done => {
            request(server)
                .head(resourceUrl)
                .set('if-none-match', resourceEtag)
                .expect(304)
                .end(done);
        });

    });

    describe('if-modified-since', () => {

        it('should be ignored when the date is invalid', done => {
            request(server)
                .get(resourceUrl)
                .set('if-modified-since', 'not a date')
                .expect(200)
                .end(done);
        });

        it('should be ignored when the method is not GET or HEAD', done => {
            request(server)
                .put(resourceUrl)
                .set('if-modified-since', resourceLastModified)
                .expect(200)
                .end(done);
        });

        it('should return 304 when not modified', done => {
            request(server)
                .get(resourceUrl)
                .set('if-modified-since', new Date(new Date(resourceLastModified) + oneDay).toUTCString())
                .expect(304)
                .end(done);
        });

        it('should return 200 when modified', done => {
            request(server)
                .get(resourceUrl)
                .set('if-modified-since', new Date(new Date(resourceLastModified) - oneDay).toUTCString())
                .expect(200)
                .end(done);
        });

    });

    describe('if-unmodified-since', () => {

        it('should be ignored when the date is invalid', done => {
            request(server)
                .put(resourceUrl)
                .set('if-umodified-since', 'not a date')
                .expect(200)
                .end(done);
        });

        it('should return 200 when not modified', done => {
            request(server)
                .put(resourceUrl)
                .set('if-umodified-since', new Date(new Date(resourceLastModified) + oneDay).toUTCString())
                .expect(200)
                .end(done);
        });

        it('should return 412 when modified', done => {
            request(server)
                .put(resourceUrl)
                .set('if-umodified-since', new Date(new Date(resourceLastModified) - oneDay).toUTCString())
                .expect(412)
                .end(done);
        });

    });


});
