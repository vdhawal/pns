'use strict';

const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert'); /*to server static files*/
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

var fs = require("fs");
var dbInfo = fs.readFileSync("./dbinfo.json");

dbInfo = JSON.parse(dbInfo);

var uri = dbInfo.uri;

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(uri, function (err, db) {
    if (err) {
        server.log('error', err);
        process.exit(0);
        return;
    }

    /*Adding a DB decorator for all requests to get access*/
    server.decorate('request', 'getMongo', function () {
        return db;
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

        /*Loading all routes*/
        routes.forEach((route) => {
            console.log(`attaching ${ route.path }`);
            server.route(route);

        });

        /*Starting the server*/
        server.start((err) => {

            if (err) {
                throw err;
            }

            console.log("Server running at:", server.info.uri);
        });
    });
});
