const schema = './backend/schema.graphql'

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
// const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const resolvers = { Query, Mutation, Link }    //, User}

const options = {
    port: process.env.API_PORT || 80,
    endpoint: '/api',
    subscriptions: '/ws',
    playground: false,
}

module.exports = {
    schema,
    options,
    resolvers
}