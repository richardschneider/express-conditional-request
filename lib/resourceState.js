'use strict';

let http = require('http'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req,addlHeaders) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'HEAD',
            protocol: req.protocol + ':',
            hostname: req.hostname,
            port: req.get('host').split(':')[1],
            path: req.originalUrl,
            headers: {}
        };
        // add custom headers to forward to head request
        forwardHeaders = forwardHeaders.concat(addlHeaders);
        forwardHeaders.forEach(name => {
            let value = req.get(name);
            if (typeof value !== 'undefined')
                options.headers[name] = value;
        });
        http
            .request(options, res => {
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            })
            .on('error', reject)
            .end();
    });
}

module.exports = getResourceStateAsync;
