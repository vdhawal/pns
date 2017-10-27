function sendNotificationToSelectedUsers(){
    var selectedUsers = $("label.is-checked").closest("tr").find("td.uuid");
    var userIds = new Array();
    $.each( selectedUsers, function( key, value ) {
        var uuid = value.innerHTML;
        userIds.push(uuid);
    });
    userIds = userIds.filter( onlyUnique );
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('POST', '/message', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
   
    var info = 
        {
            message : document.getElementById("Message").value,
            users : userIds 
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

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
