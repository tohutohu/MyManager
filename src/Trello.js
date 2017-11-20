const Trello = require('node-trello')
require('dotenv').config({path: __dirname + '/../.env'})
const t = new Trello(process.env.TRELLO_TOKEN, process.env.TRELLO_TOKEN_SECRET)

module.exports = t
