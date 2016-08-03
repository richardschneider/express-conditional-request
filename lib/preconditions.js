'use strict';

function toList(value) {
    if (typeof value === 'string' || value instanceof String) {
        return value
            .split(',')
            .map(s => s.trim());
    }

    return Array.isArray(value) ? value : [value];
}

/* Precondition
 *   header - the HTTP header of the precodition
 *   check - a function takes the request, resource state and tsheader value
 *           returns a HTTP status code, 200 for success.
 *   skip - optional name of a following precondition that should be ignored.
 */

let ifMatch = {
    header: 'if-match',
    check: () => {
        return 200;
    },
    skip: 'foo'
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
    },
    skip: 'foo'
};

let ifModifiedSince = {
    header: 'if-modified-since',
    check: () => {
        return 200;
    },
    skip: 'foo'
};

let ifUnmodifiedSince = {
    header: 'if-unmodified-since',
    check: () => {
        return 200;
    },
    skip: 'foo'
};

let ifRange = {
    header: 'if-range',
    check: () => 501
};

module.exports = [ifMatch, ifNoneMatch, ifModifiedSince, ifUnmodifiedSince, ifRange];
