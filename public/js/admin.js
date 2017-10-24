function sendNotification(){
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('POST', '/message', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var info = 
        {
            message : document.getElementById("Message").value,
        };
    xhr.send(JSON.stringify(info));
    document.getElementById("send_status").innerHTML = "Notification Sent";
}


function deleteAllEntriesFromDb(){
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('GET', '/users/delete', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send();
}