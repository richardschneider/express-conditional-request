'use strict';

let etag = require('../lib/etag');

require('should');

describe('etag', () => {
    let weak1 = 'W/"1"',
        weak2 = 'W/"2"',
        strong1 = '"1"',
        strong2 = '"2"';

    it('should be weak when it starts with W/"', () => {
        etag.isWeak(weak1).should.equal(true);
        etag.isWeak(strong1).should.equal(false);
    });

    it('should be strong when it starts with "', () => {
        etag.isStrong(strong1).should.equal(true);
        etag.isStrong(weak1).should.equal(false);
    });

    it('should do strong comparision', () => {
        etag.strongMatch(weak1, weak1).should.equal(false);
        etag.strongMatch(weak1, weak2).should.equal(false);
        etag.strongMatch(weak1, strong1).should.equal(false);
        etag.strongMatch(strong1, strong1).should.equal(true);
        etag.strongMatch(strong1, strong2).should.equal(false);
    });

    it('should do weak comparision', () => {
        etag.weakMatch(weak1, weak1).should.equal(true);
        etag.weakMatch(weak1, weak2).should.equal(false);
        etag.weakMatch(weak1, strong1).should.equal(true);
        etag.weakMatch(strong1, strong1).should.equal(true);
        etag.weakMatch(strong1, strong2).should.equal(false);
    });

});
