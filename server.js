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

        routes.forEach((route) => {
            console.log(`attaching ${ route.path }`);
            server.route(route);

        });

        server.start((err) => {

            if (err) {
                throw err;
            }

            var col = db.collection("userinfo");
            col.count().then(function (count) {
                console.log("mongdb " + count);
            });

            console.log("Server running at:", server.info.uri);
        });
    });
});
