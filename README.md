# Conditional Request 

[![Travis build status](https://travis-ci.org/richardschneider/express-conditional-request.svg)](https://travis-ci.org/richardschneider/express-conditional-request)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/express-conditional-request/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/express-conditional-request?branch=master) 
 [![npm version](https://badge.fury.io/js/express-conditional-request.svg)](https://badge.fury.io/js/express-conditional-request) 
 
Middleware for HTTP Conditional Requests ([RFC 7232](https://tools.ietf.org/html/rfc7232)).
It conditionally processes a HTTP request based on a precondition (such as an etag or modification date). 

A precondition is specified using the `If-Match`, `If-None-Match`, `If-Modified-Since` or `If-Unmodified-Since` HTTP header. 

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install express-conditional-request --save

## Usage

Include the following in your server startup

````javascript
    const conditionalRequest = require('express-conditional-request')
    app.use(conditionalRequest())
````
or
````javascript
    const conditionalRequest = require('express-conditional-request')
    const options = { ... }
    app.use(conditionRequest(options))
````

## Options

Name | Description
---- | -----------
require | When `true`, an unsafe method must include one of the precondition headers.  This prevents the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).  Defaults to `true`.

## Status code

The following HTTP status code can be returned by the middleware

Code | Reason
---- | ------
[428 Precondition Required](https://tools.ietf.org/html/rfc6585#section-3) | A precondition header is required to avoid the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).

# TODO

* The `If-Range` header is not currently supported and is ignored.


# License
The [MIT license](LICENSE).

Copyright © 2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=express-conditional-request)
