const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')

const url = 'mongodb://localhost:27017/tododb'
const dbName = 'tododb'

const client = new MongoClient(url)

module.exports = {
    dbName,
    client
}