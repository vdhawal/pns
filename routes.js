'use strict';

const routes = [
    {
        path: '/users',
        method: 'GET',
        handler: ( request, reply ) => {
            /*showing a sample DB interaction here*/
            var db = request.getMongo();
            var col = db.collection("userinfo");
            /*Fetch all the users to display in the UI*/
            col.find({}).explain( (err, explain) => {
                /* Figure out how to stream all documents as this returns the cursor */
                reply(JSON.stringify(explain));
            });
        }
    },
    {
        path: '/users',
        method: 'POST',
        handler: ( request, reply ) => {
            /*handle the post request of adding a user:-
            {
               uuid   : string - to be sent to 3rd party for identification
               browser: string - chrome, firefox, safari etc
               os     : string - mac, win
               service: string - gcm, apns
            }*/
            var db = request.getMongo();
            var col = db.collection("userinfo");
            /*Handle the case where the uuid is already present in the system*/
            col.insert(request.payload, null, (err, result) => {
                var resultObj = {
                    "success": true,
                    "result": result
                };
                if (err) {
                    resultObj.success = false;
                }
                reply(JSON.stringify(resultObj));
            });
        }
    },
    {
        path: "/users/delete", /*Delete All users for a fresh demo*/
        method: "GET",
        handler: ( request, reply ) => {
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.deleteMany({}, null, (err, result) => {
                var resultObj = {
                    "success": true,
                    "result": result
                };
                if (err) {
                    resultObj.success = false;
                }
                reply(JSON.stringify(resultObj));
            });
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
