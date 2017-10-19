'use strict';

const routes = [
    {
        path: '/users',
        method: 'GET',
        handler: ( request, reply ) => {
            /*showing a sample DB interaction here*/
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.count().then(function (count) {
                reply('GET all users - MongoDB count userinfo count: ' + count) ;
            });
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
