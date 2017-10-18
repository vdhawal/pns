'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const routes = require('./routes');

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
    host: "0.0.0.0",
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

    /*test route*/
    server.route({
        method: 'GET',
        path: '/hello',
        handler: (request, reply) => {
            reply('Hello World!');
        }

    });

    routes.forEach( ( route ) => {
        console.log( `attaching ${ route.path }` );
        server.route( route );

    } );

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log("Server running at:", server.info.uri);
    });
});
