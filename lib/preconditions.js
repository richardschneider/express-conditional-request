'use strict';

function toList(value) {
    return value
        .split(',')
        .map(s => s.trim());
}

/* Precondition
 *   header - the HTTP header of the precodition
 *   check - a function takes the request, resource state and header value
 *           returns a HTTP status code, 200 for success.
 */

let ifMatch = {
    header: 'if-match',
    check: (req, state, header) => {
        let q = true;

        // If the field-value is "*", the condition is false if the origin
        // server does not have a current representation for the target resource.
        if (header === '*') {
            q = typeof state.etag !== 'undefined';
        }

        // If the field-value is a list of entity-tags, the condition is false if none
        // of the listed tags match the entity-tag of the selected representation.
        else {
            q = toList(header).find(etag => etag === state.etag) !== undefined;
        }

        // An origin server MUST NOT perform the requested method if the
        // condition evaluates to false.
        return q ? 200 : 412;
    }
};

let ifNoneMatch = {
    header: 'if-none-match',
    check: (req, state, header) => {
        let q = true;

        // If the field-value is "*", the condition is false if the origin
        // server has a current representation for the target resource.
        if (header === '*') {
            q = typeof state.etag === 'undefined';
        }

        // If the field-value is a list of entity-tags, the condition is false if one
        // of the listed tags match the entity-tag of the selected representation.
        else {
            q = toList(header).find(etag => etag === state.etag) === undefined;
        }

        // An origin server MUST NOT perform the requested method if the
        // condition evaluates to false; instead, the origin server MUST respond
        // with either a) the 304 (Not Modified) status code if the request
        // method is GET or HEAD or b) the 412 (Precondition Failed) status code
        // for all other request methods.
        return q ? 200
            : (req.method === 'GET' || req.method === 'HEAD') ? 304 : 412;
    }
};

let ifModifiedSince = {
    header: 'if-modified-since',
    check: (req, state, header) => {
        // A recipient MUST ignore If-Modified-Since if the request contains an
        // If-None-Match header field
        if (req.get('if-none-match'))
            return 200;

        // A recipient MUST ignore the If-Modified-Since header field if the
        // request method is neither GET nor HEAD
        if (req.method != 'GET' && req.method != 'HEAD')
            return 200;

        // A recipient MUST ignore the If-Modified-Since header field if the
        // received field-value is not a valid HTTP-date
        var date = new Date(header);
        if (isNaN(date))
            return 200;

        // The origin server SHOULD NOT perform the requested
        // method if the selected representation's last modification date is
        // earlier than or equal to the date provided in the field-value;
        // instead, the origin server SHOULD generate a 304 (Not Modified)
        // response, including only those metadata that are useful for
        // identifying or updating a previously cached response.
        if (new Date(state.lastModified) <= date) {
            return 304;
        }

        return 200;
    }
};

let ifUnmodifiedSince = {
    header: 'if-unmodified-since',
    check: (req, state, header) => {
        // A recipient MUST ignore If-Unmodified-Since if the request contains
        // an If-Match header field
        if (req.get('if-match'))
            return 200;

        // A recipient MUST ignore the If-Modified-Since header field if the
        // received field-value is not a valid HTTP-date
        var date = new Date(header);
        if (isNaN(date))
            return 200;

        // The origin server MUST NOT perform the requested method
        // if the selected representation's last modification date is more
        // recent than the date provided in the field-value; instead the origin
        // server MUST respond with either a) the 412 (Precondition Failed)
        // status code.
        if (new Date(state.lastModified) > date) {
            return 412;
        }

        return 200;
    }
};

let ifRange = {
    header: 'if-range',
    check: () => 501
};

module.exports = [ifMatch, ifNoneMatch, ifModifiedSince, ifUnmodifiedSince, ifRange];
