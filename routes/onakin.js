const express = require('express');
const router = express.Router();

const MongoManager = require('../src/MongoManager')
let onakin


router.post('/onakin/update', (req, res) => {
  onakin.insertOne(req.body, (err) => {
    if(err){
      res.status = 500
      res.json(err)
    }

    res.status = 201
    res.json({'ok': true})
  })
})

router.get('/onakin/time', (req, res) => {
  onakin.find().sort({_id: -1}).limit(1).toArray( (err, doc) => {
    res.json(doc[0])
  })
})

const init = async () => {
  onakin = await MongoManager.getCollection('Onakin')
  return router
}

module.exports = init
