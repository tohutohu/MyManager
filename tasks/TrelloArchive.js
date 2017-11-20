const MongoManager = require('./MongoManager');
const CronJob = require('cron').CronJob;
const t = require('../src/Trello');
const moment = require('moment')
const dayTasks = new CronJob({
  cronTime: '55 23 * * *',
  onTick:async function () {
    const Trello = await MongoManager.getCollection('Trello')
    t.get('/1/list/57dd650424d5552396a9a18c/cards', (err, data) => {
      const po = {};
      po.date = moment().format('YYYY-MM-DD');
      po.number = data.length;
      po.tasks = data;

      Trello.insertOne(po, () => {

        t.post('/1/lists/57dd650424d5552396a9a18c/archiveAllCards', () => {});
      });
    });
  },
  start: false
});
module.exports = dayTasks
