'use strict';

let express = require('express'),
    conditionalRequest = require('..');

module.exports = options => {
    var app = express(),
        store = {};

    app.use(conditionalRequest(options));

    app.get('/:id', (req, res) => {
        let resource = store[req.params.id];
        if (!resource) return res.status(404).end();
        res
            .status(200)
            .set('ETag', resource.version)
            .set('Last-Modified', resource.lastModified)
            .send(resource.data)
            .end();
    });

    app.post('/:id', (req, res) => {
        if (store[req.params.id]) return res.status(422).end();

        let resource = {
            version: 1,
            lastModified: new Date().toUTCString(),
            data: req.text
        };
        store[req.params.id] = resource;
        res
            .status(201)
            .location(req.path)
            .set('ETag', resource.version)
            .set('Last-Modified', resource.lastModified)
            .end();
    });

    return app;
};
