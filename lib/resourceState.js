'use strict';

let http = require('http');

function getResourceStateAsync(req) {
    return new Promise((resolve, reject) => {
        let options = {
            method: 'HEAD',
            protocol: req.protocol + ':',
            hostname: req.hostname,
            port: req.get('host').split(':')[1],
            path: req.originalUrl
        };
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
