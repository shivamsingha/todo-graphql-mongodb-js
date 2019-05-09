const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')

const url = process.env.MONGO_URL || 'mongodb://localhost:27017/tododb'
const dbName = 'tododb'

const client = new MongoClient(url, { useNewUrlParser: true })

module.exports = {
    dbName,
    client
}
