'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, "public")
            }
        }
    }
});

server.connection({ 
    host: "localhost",
    port: 8000
});

server.register(require("inert"), (err) => {

    if (err) {
        throw err;
    }
    
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });
    
    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log("Server running at:", server.info.uri);
    });
});
