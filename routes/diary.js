const express = require('express');
const router = express.Router();
const MongoManager = require('../src/MongoManager')
let Diary

router.post('/diary', (req, res) => {
  Diary.insertOne(req.body, () => {
    res.json({ok: true})
  })
})

const init = async () => {
  Diary = await MongoManager.getCollection('Diary')
  return router
}

module.exports = init

