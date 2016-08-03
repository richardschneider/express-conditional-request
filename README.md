# Conditional Requests

[![Travis build status](https://travis-ci.org/richardschneider/express-conditional-request.svg)](https://travis-ci.org/richardschneider/express-conditional-request)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/express-conditional-request/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/express-conditional-request?branch=master) 
 [![npm version](https://badge.fury.io/js/express-conditional-request.svg)](https://badge.fury.io/js/express-conditional-request) 
 
Middleware for HTTP Conditional Requests ([RFC 7232](https://tools.ietf.org/html/rfc7232)).
It conditionally processes a HTTP request based on a precondition (such as an etag or modification date). 

A precondition is specified using the `If-Match`, `If-None-Match`, `If-Modified-Since` or `If-Unmodified-Since` HTTP header. 

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install express-conditions --save

## Usage

Include the following in your server startup

````javascript
    const conditions = require('express-conditions')
    app.use(conditions())
````
or
````javascript
    const conditions = require('express-conditions')
    const options = { ... }
    app.use(conditions(options))
````

See our [test server](https://github.com/richardschneider/express-conditional-request/blob/master/test/server.js) for more details.
## Options

Name | Description
---- | -----------
requiredWith | An array of HTTP methods that must include one of the precondition headers.  This prevents the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).  Defaults to `['PUT', 'PATCH', 'DELETE']`.
stateAsync | A function that returns a `Promise` to the get the resource state.

### Resource state

The resource state contains the `etag` and `lastModified` properties, which conform to the respective HTTP headers.

The default `stateAsync()` obtains the state by sending a `HEAD` request to the server.

## Status code

The following HTTP status codes can be returned by the middleware

Code | Reason
---- | ------
[304 (Not Modified)](https://tools.ietf.org/html/rfc7232#section-4.1) | The resource has not been modified since the version specified by the precondition(s).
[412 (Precondition Failed)](https://tools.ietf.org/html/rfc7232#section-4.2) | A precondition failed.
[428 (Precondition Required)](https://tools.ietf.org/html/rfc6585#section-3) | A precondition header is required to avoid the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).
[501 (Not implemented)](https://tools.ietf.org/html/rfc7231#section-6.6.2s) | A precondition is not yet implemented.
# TODO

* The `If-Range` header is not currently supported.


# License
The [MIT license](LICENSE).

Copyright © 2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=express-conditional-request)
