const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)

    try {
        const r = await context.db.collection('users').insertOne({ ...args, password })
        if (!(r.result.ok === 1 && r.insertedCount === 1))
            throw new Error('insertOne() not executed correctly')

        const userId = r.insertedId
        const token = jwt.sign({ userId: userId }, APP_SECRET, { algorithm: 'HS512' })

        // context.response.setHeader('Set-Cookie', 'token=' + token + ';HttpOnly;SameSite=Strict')
        context.response.cookie('token', token, { httpOnly: true, sameSite: 'Strict' })

        return {
            token,
            userId
        }
    }
    catch (err) {
        // context.response.statusCode = 500
        // context.response.statusMessage = 'Internal Server Error, ' + err.toString()
        context.response.status(500).send('Internal Server Error, ' + err.toString())
        console.error(err)
    }
}

async function login(parent, args, context, info) {
    try {
        const r = await context.db.collection('users').findOne({ email: args.email })
        if (!r) {
            // context.response.statusCode = 401
            // context.response.statusMessage = 'Unauthorized, No such user found'
            context.response.status(401).send('Unauthorized, No such user found')
            throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
            // context.response.statusCode = 401
            // context.response.statusMessage = 'Unauthorized, Invalid password'
            context.response.status(401).send('Unauthorized, Invalid password')
            throw new Error('Invalid password')
        }

        const userId = r._id
        const token = jwt.sign({ userId: userId }, APP_SECRET, { algorithm: 'HS512' })

        context.response.cookie('token', token, { httpOnly: true, sameSite: 'Strict' })

        return {
            token,
            user,
        }
    }
    catch (err) {
        console.error(err)
    }
}

function post(parent, args, context, info) {
    try {
        const userId = getUserId(context)
        const r=await context.db.collection('tasks').insertOne({
            title:args.title,
            description:args.description,
            creationTime:String(Date.now())
            /// WIP ...
        })
    } catch (err) {
        console.error(err)
    }

    // moved...
}

module.exports = {
    signup,
    login,
    post,
}  

/*
From GraphQL tutorial for reference
    return context.prisma.createLink({
        title: args.title,
        description: args.description,
        postedBy: { connect: { id: userId } },
    })
*/