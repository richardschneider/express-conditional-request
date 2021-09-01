# Conditional Requests

This is a small extenstion to Richard Schneider's [express-preconditions](https://www.npmjs.com/package/express-preconditions) package.
 
Middleware for HTTP Conditional Requests ([RFC 7232](https://tools.ietf.org/html/rfc7232)).
It conditionally processes a HTTP request based on a precondition (such as an etag or modification date). 
A precondition is specified using the `If-Match`, `If-None-Match`, `If-Modified-Since` or `If-Unmodified-Since` HTTP header. 

The [change log](https://github.com/richardschneider/express-conditional-request/releases) is automatically produced with
the help of [semantic-release](https://github.com/semantic-release/semantic-release).

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install express-preconditions-addl --save

## Usage

Include the following in your server startup

````javascript
    const preconditions = require('express-preconditions-addl')
    app.use(preconditions())
````
or
````javascript
    const preconditions = require('express-preconditions-addl')
    const options = { ... }
    app.use(preconditions(options))
````

See our [test server](https://github.com/richardschneider/express-conditional-request/blob/master/test/server.js) for more details.
## Options

Name | Description
:---- | :-----------
error | A function that takes (`status code, message, req, res`) and sends an error response.
requiredWith | An array of HTTP methods that must include one of the precondition headers.  This prevents the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).  Defaults to `['PUT', 'PATCH', 'DELETE']`.
stateAsync | A function that takes `(req)` and returns a `Promise` to the get the assoiciated resource state.
forwardHeaders | Additional option added to existing express-preconditions package to support sending custom headers to HEAD request.Defaults to `[]`

### Resource state

The resource state contains the `etag` and `lastModified` properties, which conform to the respective HTTP headers
and can be `undefined`.

The default `stateAsync()` obtains the resource state by sending a `HEAD` request to the server.

## Status codes

The following HTTP status codes can be returned by the middleware

Code | Reason
:---- | :------
[304 (Not Modified)](https://tools.ietf.org/html/rfc7232#section-4.1) | The resource has not been modified since the version specified by the precondition(s).
[412 (Precondition Failed)](https://tools.ietf.org/html/rfc7232#section-4.2) | A precondition failed.
[428 (Precondition Required)](https://tools.ietf.org/html/rfc6585#section-3) | A precondition header is required to avoid the [lost update issue](https://en.wikipedia.org/wiki/Concurrency_control).
[501 (Not implemented)](https://tools.ietf.org/html/rfc7231#section-6.6.2s) | A precondition is not yet implemented.

# TODO

* The `If-Range` header is not currently supported.


# License
The [MIT license](LICENSE).

