// Send the Instance ID token your application server, so that it can:
// - send messages back to this app
// - subscribe/unsubscribe the token from topics
function sendTokenToServer(currentToken, topic) {
  //  if (!isTokenSentToServer()) {
        console.log('Sending token to server...');
        var xhr = new XMLHttpRequest();   // new HttpRequest instance 
        xhr.open('POST', '/users', true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onload = function () {
        console.log(this.responseText);
        }; 
        var currentBrowser = getCurrentBrowserName();
        var messagingService = currentBrowser == "Safari" ? "apns" : "gcm";
        var info = {
            uuid : currentToken,
            topic : topic,
            browser : currentBrowser,
            os : navigator.platform,
            service : messagingService
        };
        xhr.send(JSON.stringify(info));
        setTokenSentToServer(true);
  //  } else {
  //      console.log('Token already sent to server so won\'t send it again ' +
  //          'unless it changes');
  //  }
}

function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
}

function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}


function removeTokenFromDB(currentToken){
    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open('DELETE', '/users', true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
        console.log(this.responseText);
    }; 

    var payload = 
    {
        token : currentToken
    };

    xhr.send(JSON.stringify(payload));
}

function getCurrentBrowserName() {
    if(navigator.userAgent.indexOf("Opera") != -1 || navigator.userAgent.indexOf('OPR') != -1 ) 
    {
        return 'Opera';
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1 )
    {
        return 'Chrome';
    }
    else if(navigator.userAgent.indexOf("Safari") != -1)
    {
        return 'Safari';
    }
    else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
    {
        return 'Firefox';
    }
    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
    {
        return 'IE'; 
    }  
    else 
    {
        return 'unknown';
    }
}