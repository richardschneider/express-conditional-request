'use strict';

let request = require('supertest');

require('should');

describe('Resource state', () => {

    var server, resourceUrl, resourceEtag;

    beforeEach(function (done) {
        server = require('./server')({ Authorize: true});
        request(server)
            .post('/something')
            .set('authorization', 'Basic YWxpY2U6eHl6enk=')
            .send('cruft')
            .expect(201)
            .expect(function (res) {
                resourceUrl = res.header['location'];
                resourceEtag = res.header['etag'];
            })
            .end(done);
    });

    it('should succeed when etag exists', done => {
        request(server)
            .put(resourceUrl)
            .set('authorization', 'Basic YWxpY2U6eHl6enk=')
            .set('if-match', resourceEtag)
            .expect(200)
            .end(done);
    });

});
