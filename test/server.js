'use strict';

let express = require('express'),
    preconditions = require('..');

module.exports = options => {
    var app = express(),
        store = {};

    if (options && options.Authorize) {
        app.use((req, res, next) => {
            if (!req.get('Authorization'))
               return res.status(401).end();
            next();
        });
    }

    app.use(preconditions(options));

    app.get('/:id', (req, res) => {
        let resource = store[req.params.id];
        if (!resource) return res.status(404).end();
        res
            .status(200)
            .set('ETag', '"' + resource.version + '"')
            .set('Last-Modified', resource.lastModified)
            .send(resource.data)
            .end();
    });

    app.post('/:id', (req, res) => {
        if (store[req.params.id]) return res.status(409).end();

        let resource = {
            version: 1,
            lastModified: new Date().toUTCString(),
            data: req.text
        };
        store[req.params.id] = resource;
        res
            .status(201)
            .location(req.path)
            .set('ETag', '"' + resource.version + '"')
            .set('Last-Modified', resource.lastModified)
            .end();
    });

    app.put('/:id', (req, res) => {
        let resource = store[req.params.id];
        if (!resource) return res.status(404).end();

        resource.version += 1;
        resource.lastModified = new Date().toUTCString();
        resource.data = req.text;
        res
            .status(200)
            .location(req.path)
            .set('ETag', '"' + resource.version + '"')
            .set('Last-Modified', resource.lastModified)
            .end();
    });

    return app;
};
