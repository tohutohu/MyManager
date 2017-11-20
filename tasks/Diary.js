const CronJob = require('cron').CronJob;
const notification = require('../src/notification.js')
const moment = require('moment')
const MongoManager = require('../src/MongoManager.js')

const diaryReminder = new CronJob({
  cronTime: '0 7 * * *',
  onTick: async function () {
    const date = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const Diary = await MongoManager.getCollection('Diary')
    Diary.findOne({date: date}, (err, doc) => {
      if(err) {
        /* eslint-disable no-console */
        console.log(err)
        return
      }
      if (!doc) {
        notification({
          title: '日記が書かれていません！',
          body: date + 'の日記を書きましょう！',
          link: 'https://manager.to-hutohu.com'
        })
      }
    })
  },
  start: false
})
module.exports = diaryReminder
