'use strict';

var fs = require("fs");
var dbInfo = fs.readFileSync("./dbinfo.json");

dbInfo = JSON.parse(dbInfo);

var uri = dbInfo.uri;

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(uri, function(err, db1) {
    if (err) {
        console.log(err);
    } else {
        var col = db1.collection("userinfo");
        col.count().then(function (count){
            console.log("mongdb " + count);   
        });
    }
});

const routes = [
    {
        path: '/users',
        method: 'GET',
        handler: ( request, reply ) => {
            reply('GET all users');
        }
    },
    {
        path: '/users',
        method: 'POST',
        handler: ( request, reply ) => {
            reply('POST a new user');
        }
    },
    {
        path: '/message',
        method: 'POST',
        handler: ( request, reply ) => {
            reply('POST an array of messages');
        }
    }
];

module.exports = routes;