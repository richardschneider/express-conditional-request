'use strict';

const getHead = function(url) {
    return new Promise((resolve, reject) => {
        const server = url.startsWith('https') ? require('https') : require('http');
        server
            .get(url, (response) => {
                const state = {
                    etag: response.headers['etag'],
                    lastModified: response.headers['last-modified']
                };
                resolve(state);
            })
            .on('error', reject);
    });
};

function stateAsync(req) {
    return getHead( `${req.protocol}://${req.get('host')}${req.originalUrl}`);
}

module.exports = stateAsync;
