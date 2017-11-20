const express = require('express');
const router = express.Router();
const shortid = require('shortid')

const MongoManager = require('../src/MongoManager')
let hitomemo

router.post('/hitomemo/create', function(req, res) {
  const ins = req.body
  const po = {}
  if(!ins.id){
    ins.id = shortid.generate()
    po.title = '新規登録'
    po.message = req.body.name + 'を新しく登録しました'
  }else{
    po.title = '情報の更新'
    po.message = req.body.name + 'の情報を更新しました'
  }
  hitomemo.updateOne({id: ins.id}, ins, {upsert: true}, (err) => {
    if(err){
      res.statusCode = 500
      res.json({error: 'mongodb error'})
      return
    }

    po.name = req.body.name
    po.id = ins.id
  
    res.statusCode = 201
    res.json(po)
  })
});

router.get('/hitomemo/detail', function(req, res) {
  hitomemo.findOne({id: req.query.id}, {fields: {_id: 0}}, (err, doc) => {
    if(err){
      res.statusCode = 500
      res.json({error: 'mongodb error'})
      return
    }

    if(!doc){
      res.statusCode = 404
      res.json({})
      return
    }

    res.statusCode = 200
    res.json(doc)
  })
})

router.get('/hitomemo/list', function(req, res) {
  hitomemo.find({}, {fields: {name: 1, call:1, tags: 1, id: 1}}).toArray((err, doc) => {
    if(err){
      res.statusCode = 500
      res.json({error: 'mongodb error'})
      return
    }

    res.statusCode = 200
    res.json(doc)
  })
})

const init = async () => {
  hitomemo = await MongoManager.getCollection('Hitomemo')
  return router
}

module.exports = init;
