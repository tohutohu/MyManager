const express = require('express');
const moment = require('moment')
const router = express.Router();
const Trello = require('../src/Trello.js')

router.post('/trello/test', (req, res) => {
  Trello.post('/1/cards', {idList: '57dd650424d5552396a9a18c'}, (err, data) => {
    res.send({ok: true})
  })
})

const init = async () => {
  return router
}

module.exports = init
