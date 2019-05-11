const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)

    try {
        let r=await context.db.collection('users').find({email:args.email}).toArray()
        if(r) {
            context.response.status(401).send('Unauthorized; User already exists')
            throw new Error('User already exists')
        }
        
        r = await context.db.collection('users').insertOne({ ...args, password })
        if (!(r.result.ok === 1 && r.insertedCount === 1)) {
            context.response.status(500).send('Internal Server Error; insertOne() not executed correctly')
            throw new Error('insertOne() not executed correctly')
        }

        const user = r.ops[0]
        const token = jwt.sign({ userId: user._id }, APP_SECRET, { algorithm: 'HS512' })

        context.response.cookie('token', token, { httpOnly: true, sameSite: 'Strict' })

        return {
            token,
            user
        }
    }
    catch (err) {
        console.error(err)
    }
}

async function login(parent, args, context, info) {
    try {
        const r = await context.db.collection('users').findOne({ email: args.email })
        if (!r) {
            context.response.status(401).send('Unauthorized; No such user found')
            throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(args.password, r.password)
        if (!valid) {
            context.response.status(401).send('Unauthorized; Invalid password')
            throw new Error('Invalid password')
        }

        const user = r
        const token = jwt.sign({ userId: user._id }, APP_SECRET, { algorithm: 'HS512' })

        context.response.cookie('token', token, { httpOnly: true, sameSite: 'Strict' })

        return {
            token,
            user
        }
    }
    catch (err) {
        console.error(err)
    }
}

async function post(parent, args, context, info) {
    try {
        const userId = getUserId(context)
        
        const user = await context.db.collection('users').findOne({ _id: userId })
        if (!r) {
            context.response.status(401).send('Unauthorized; Invalid Token')
            throw new Error('Invalid Token')
        }

        const r=await context.db.collection('tasks').insertOne({
            title:args.title,
            description:args.description,
            creationTime:String(Date.now()),
            postedBy: userId,
            finished: false
        })
        if (!(r.result.ok === 1 && r.insertedCount === 1)) {
            context.response.status(500).send('Internal Server Error; insertOne() not executed correctly')
            throw new Error('insertOne() not executed correctly')
        }

        const {_id, title, description, creationTime, postedBy, finished} = r.ops[0]
        return {
            _id, 
            title, 
            description, 
            creationTime, 
            user, 
            finished
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    signup,
    login,
    post,
}