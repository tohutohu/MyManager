self.addEventListener('push', e => {
  const data = e.data.json()
  const title = data.title
  const options = {
    body: data.body,
    data: {
      link_to: data.link
    }
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data.link_to))
})
