var subscribers;

function sendNotificationToSelectedUsers(){
    var selectedUsers = $("input.is-checked").closest("tr").find("td.uuid");
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
    xhr.onload = createTable();
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function filterUsers(){
    if (subscribers){
        var inputTxt = document.getElementById("txtSearch").value;
        var filteredResults = new Array();
        subscribers.forEach(function(subscriber){
            if (JSON.stringify(subscriber).search(new RegExp(inputTxt, "i")) >=0)
                filteredResults.push(subscriber);
        });
        insertInTable(filteredResults);
    }
}

function createTable() {
    var xmlhttp, myObj;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function() {
            myObj = JSON.parse(this.responseText);
            subscribers = myObj.result;
            insertInTable(myObj.result);
            $("input.mdl-checkbox__input").on("click",function(){
            if ($(this).hasClass("is-checked"))
                $(this).removeClass("is-checked");
            else
                $(this).addClass("is-checked");
            });
    }
    xmlhttp.open("GET", "/users", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
}

function insertInTable(users){
    var index = 0;
    var txt = "";
    users.forEach(function(user){
        index++;
        txt += "<tr><td><label class='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select' for='row" + index + "'><input type='checkbox' id='row" + index + "' class='mdl-checkbox__input' /></label></td><td class='mdl-data-table__cell--non-numeric--selectable'>" + user.topic + "</td><td>" + user.browser + "</td><td>" + user.os + "</td><td>" + user.service + "</td><td class = 'uuid'>" + user.uuid + "</td></tr>";
    });
    document.getElementById("tableBody").innerHTML = txt;
}
