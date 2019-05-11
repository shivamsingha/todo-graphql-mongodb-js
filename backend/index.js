const { GraphQLServer } = require('graphql-yoga')
const cookieParser = require('cookie-parser')

const { client, dbName } = require('./mongo')
const { schema, options, resolvers } = require('./graphqlConfig')

process.on('exit', (code) => {
    client.close()
    console.log(`Exiting with code ${code}`)
})

(async function () {
    try {
        await client.connect()
        const db = client.db(dbName)
        const server = new GraphQLServer({
            typeDefs: schema,
            resolvers,
            context: (req) => ({ ...req, db })
        })
        server.express.use(cookieParser())
        server.start(options, ({ port }) => console.log(`Server is running on http://localhost:${port}`))
    }
    catch (err) {
        console.error(err.stack)
    }
})()