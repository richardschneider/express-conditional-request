# express-conditional-request 

Middleware for HTTP Conditional Requests ([RFC 7232](https://tools.ietf.org/html/rfc7232)).
It conditionally processes a HTTP request based on a precondition (such as an etag or modification date). 

A precondition is specified using the `If-Match`, `If-None-Match`, `If-Modified-Since` or `If-Unmodified-Since` HTTP header. 

### Features

* Uncertainty - `express-conditional-request('123.456(4) km')`
* SI notation - `express-conditional-request('1.234 56(4) × 10² km')`
* ASCII notation - `express-conditional-request('1.234 56(4) x 10^2 km')`
* Conversion - `express-conditional-request('25 m/s').to('km/h')`
* Symbolic expressions - `express-conditional-request('W/(m² sr)')`
* Pluggable - `express-conditional-request.config.Number = require('big.js')`

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install express-conditional-request --save

## Usage

Include the following in your server startup

    const conditionalRequest = require('express-conditional-request')
    app.use(conditionalRequest())
    
    -- or
    
    const options = { ... }
    appu.use(conditionRequest(options))


# TODO

* The `If-Range` header is not currently supported and is ignored.


# License
The [MIT license](LICENSE).

Copyright © 2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=express-conditional-request)
