const { GraphQLServer } = require('graphql-yoga')
const cookieParser = require('cookie-parser')

const mongo = require('./mongo')
const config = require('./graphqlConfig')

(async function () {
    try {
        await client.connect()
        const db = client.db(mongo.dbName)
        const server = new GraphQLServer({
            typeDefs: config.schema,
            config.resolvers,
            context: (request, response) => ({ ...request, response, db })
        })
        server.express.use(cookieParser())
        server.start(config.options, ({ port }) => console.log(`Server is running on http://localhost:${port}`))
    }
    catch (err) {
        console.error(err.stack)
    }

    client.close()
})()