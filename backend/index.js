const { GraphQLServer } = require('graphql-yoga')
const cookieParser = require('cookie-parser')

const { client, dbName } = require('./mongo')
const config = require('./graphqlConfig')
const resolvers = config.resolvers;

(async function () {
    try {
        await client.connect()
        const db = client.db(dbName)
        const server = new GraphQLServer({
            typeDefs: config.schema,
            resolvers,
            context: (req) => ({ ...req, db })
        })
        server.express.use(cookieParser())
        server.start(config.options, ({ port }) => console.log(`Server is running on http://localhost:${port}`))
    }
    catch (err) {
        console.error(err.stack)
    }
})()

function exitHandler(code) {
    client.close()
    console.warn(`Exiting with code ${code}`)
}

process.on('exit', exitHandler)
process.on('SIGINT', ()=>process.exit(0))
process.on('SIGTERM', ()=>process.exit(0))
process.on('SIGHUP', ()=>process.exit(0))