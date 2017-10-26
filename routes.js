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
        path: '/users', /*Delete user on Unsubscribe or token refresh*/
        method: 'DELETE',
        handler: (request, reply) => {
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.remove({uuid:request.payload.token}, true, (err, result) => {
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
            var db = request.getMongo();
            var col = db.collection("userinfo");
            col.find().forEach( function(user) { 
                try{
                    sendMessage(request.payload.message, user.uuid);
                }
                catch(e)
                {
                    console.log(e.message);
                }
            });
        }
    },
    {
        path: "/admin",
        method: "GET",
        handler: (request, reply) => {
            try{
                reply.file("/admin.html");
            }
            catch(e){
                console.log(e.message);
            }
        }
    },
    {
        path: "/xd1",
        method: "GET",
        handler: (request, reply) => {
            reply.file("/xd1.htm");
        }
    },
    {
        path: "/xd",
        method: "GET",
        handler: (request, reply) => {
            reply.file("/xd.htm");
        }
    }
];

function sendMessage(message, reciever){
    
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('POST', "https://fcm.googleapis.com/fcm/send", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.setRequestHeader("Authorization", "key="+sender_key);

    xhr.onload = function () {
        // do something to response
    console.log(this.responseText);
    }; 
    var obj = {
        "notification":{
            "title": "Sample Notification",
            "body": message
        },
        "to": reciever
        }
        try{
            xhr.send(JSON.stringify(obj));
        }
        catch(e){
            console.log(e.message);
        }
}

module.exports = routes;
