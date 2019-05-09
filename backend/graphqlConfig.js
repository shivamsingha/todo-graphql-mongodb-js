const schema = './backend/schema.graphql'

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
// const User = require('./resolvers/User')
const Task = require('./resolvers/Task')

const resolvers = { Query, Mutation, Task }    //, User}

const options = {
    port: process.env.API_PORT || 8080,
    endpoint: '/api',
    subscriptions: '/ws',
    playground: false,
}

module.exports = {
    schema,
    options,
    resolvers
}
