'use strict';
let https = require('https');
let axios = require('axios'),
    forwardHeaders = ['Authorization'];

function getResourceStateAsync(req,addlHeaders) {
    return new Promise((resolve, reject) => {
        // Updating this to axios as http does not follow redirects
        let options = {
            method: 'HEAD',
            baseURL: `${req.protocol}://${req.get('host')}`,
            url: req.originalUrl,
            headers: {},
            httpsAgent: new https.Agent({
                  rejectUnauthorized: false
            })      
        };
        // add custom headers to forward to head request
        forwardHeaders = forwardHeaders.concat(addlHeaders);
        forwardHeaders.forEach(name => {
            let value = req.get(name);
            if (typeof value !== 'undefined')
                options.headers[name] = value;
        });
        axios.request(options)
         .then(res => {
                resolve({
                    etag: res.headers['etag'],
                    lastModified: res.headers['last-modified']
                });
            })
          .catch(reject);
    });
}

module.exports = getResourceStateAsync;
