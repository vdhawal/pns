'use strict';

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