const MongoManager = require('./MongoManager');
const webpush = require('web-push')
require('dotenv').config({path: __dirname + '/../.env'})


const GCM_API_KEY = process.env.GCM_API_KEY
webpush.setGCMAPIKey(GCM_API_KEY)

const notification = async (message) => {
  const push = await MongoManager.getCollection('Push')
  push.find({}).toArray((err, docs) => {
    docs.forEach(doc => {
      const pushOption = {
        endpoint: doc.endpoint,
        keys: {
          p256dh: doc.publicKey,
          auth: doc.authSecret
        }
      }

      webpush.sendNotification(pushOption, JSON.stringify(message))
    })
  })
}

module.exports = notification
