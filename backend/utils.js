const jwt = require('jsonwebtoken')
const APP_SECRET = process.env.SECRET

function getUserId(context) {
  // const Authorization = context.request.get('Authorization')
  const Authorization = context.request.cookie.token
  if (Authorization) {
    // const token = Authorization.replace('Bearer ', '')
    const token = Authorization
    const { userId } = jwt.verify(token, APP_SECRET, { algorithm: 'HS512' })
    return userId
  }
  throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  getUserId,
}
