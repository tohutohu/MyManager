const CronJob = require('cron').CronJob;
const notification = require('../src/notification.js')
const moment = require('moment')
const MongoManager = require('../src/MongoManager.js')

const BirthDayNotify = new CronJob({
  cronTime: '1 0 * * *',
  onTick: async function () {
    const date = moment().format('MM-DD')
    const Hitomemo = await MongoManager.getCollection('Hitomemo')
    const reg = new RegExp(date)
    Hitomemo.find({birthday: reg}).toArray((err, doc) => {
      if(err) {
        /* eslint-disable no-console */
        console.log(err)
        return
      }
      console.log(doc)
      if (doc) {
        doc.forEach(p => {
          notification({
            title: '今日は' + (p.name || p.call || '名無し') + 'さんの誕生日です！',
            body: 'おめでたいね！',
            link: 'https://twitter.com'
          })
        })
      }
    })
  },
  start: false
})
module.exports = BirthDayNotify
