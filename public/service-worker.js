'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event.data.text());

  var info = JSON.parse(event.data.text());
  var title = info.notification.title;
  var body = info.notification.body;
  var icon = 'images/XD-logo.png';
  var tag = info.data.url;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();
  var url = event.notification.tag;
  console.log("event.notification.tag " + event.notification.tag);

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === url && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(url);
    }
  }));
});
