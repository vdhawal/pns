'use strict';

const routes = [
    {
        path: '/users', /*Fetch all the users to display in the UI*/
        method: 'GET',
        handler: (request, reply) => {
            var db = request.getMongo();
            var col = db.collection("userinfo");
            var resultObj = {
                "success": true,
                "result": []
            };
            col.find({}).toArray((err, docs) => {
                if (err) {
                    resultObj.success = false;
                } else {
                    resultObj.result = docs;
                }
                reply(JSON.stringify(resultObj));
            });
        }
    },
    {
        path: '/users', /*handle the post request of adding a user*/
        method: 'POST',
        handler: (request, reply) => {
            /*
            {
               uuid   : string - to be sent to 3rd party for identification
               browser: string - chrome, firefox, safari etc
               os     : string - mac, win
               service: string - gcm, apns
            }*/
            var db = request.getMongo();
            var col = db.collection("userinfo");
            /*Handle the case where the uuid is already present in the system*/
            col.find({"uuid": request.payload.uuid}).toArray((err, docs) => {
                var resultObj = {
                    "success": true,
                    "result": docs
                };
                console.log(JSON.stringify(docs));
                if (err) {
                    resultObj.succes = false;
                    reply(JSON.stringify(resultObj));
                } else {
                    if (docs.length) {
                        resultObj.success = false;
                        resultObj.result = "UUID already exists";
                        reply(JSON.stringify(resultObj));
                    } else {
                        col.insert(request.payload, null, (err, result) => {
                            resultObj.result = result;
                            if (err) {
                                resultObj.success = false;
                            }
                            reply(JSON.stringify(resultObj));
                        });
                    }
                }
            });
        }
    },
    {
        path: "/users/delete", /*Delete All users for a fresh demo*/
        method: "GET",
        handler: (request, reply) => {
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
        handler: (request, reply) => {
            reply('POST an array of messages');
        }
    }
];

module.exports = routes;
