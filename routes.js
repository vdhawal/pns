'use strict';

var fs = require("fs");
var senderInfo = fs.readFileSync("./senderInfo.json");

senderInfo = JSON.parse(senderInfo);
var sender_key = senderInfo.sender_key;

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
               topic  : string - to identify the channel to which user subscribes
               browser: string - chrome, firefox, safari etc
               os     : string - mac, win
               service: string - gcm, apns
            }*/
            var db = request.getMongo();
            var col = db.collection("userinfo");
            /*Handle the case where the uuid is already present in the system*/
            col.find({"uuid": request.payload.uuid, "topic":request.payload.topic}).toArray((err, docs) => {
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
        path: '/users', /*Delete user on Unsubscribe or token refresh*/
        method: 'DELETE',
        handler: (request, reply) => {
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.remove({uuid:request.payload.token, topic:request.payload.topic}, true, (err, result) => {
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
            var users = request.payload.users;
            users.forEach( function(user) { 
                try{
                    sendMessage(request.payload, user);
                }
                catch(e)
                {
                    console.log(e.message);
                }
            });
        }
    },
    {
        path: '/subscriptionStatus', /* status : false indicates token not present in DB*/
        method: 'POST',
        handler: (request, reply) => {
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.find({"uuid": request.payload.token, "topic":request.payload.topic}).toArray((err, docs) => {
                var resultObj = {
                    "status": false
                };
                if (err) {
                    resultObj.status = false;
                    reply(JSON.stringify(resultObj));
                }
                else {
                    if (docs.length) {
                        resultObj.status = true;
                    }
                    else {
                        resultObj.status = false;
                    }
                    reply(JSON.stringify(resultObj));
                }
            });
        }
    }
];

function sendMessage(payload, reciever){
    
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('POST', "https://fcm.googleapis.com/fcm/send", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "key="+sender_key);

    xhr.onload = function () {
    console.log(this.responseText);
    }; 
    var title = payload.title;
    var message = payload.message;
    var url = payload.url;
    var obj = {
        "notification":{
            "title": title,
            "body": message,
            "tag": url

        },
        "to": reciever,
        "data": {
            url: url
        }
        }
        try{
            xhr.send(JSON.stringify(obj));
        }
        catch(e){
            console.log(e.message);
        }
}

module.exports = routes;
