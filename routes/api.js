const express = require('express');
const router = express.Router();

const hitomemo = require('./hitomemo')
const onakin = require('./onakin')
const diary = require('./diary')
const trello = require('./trello')

const init = async () => {
  router.use(await hitomemo())
  router.use(await onakin())
  router.use(await diary())
  router.use(await trello())
  return router
}

module.exports = init;
