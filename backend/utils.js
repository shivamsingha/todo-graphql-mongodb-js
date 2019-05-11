const jwt = require('jsonwebtoken')
const APP_SECRET = () => {
  if(!process.env.SECRET)
    throw new Error('App Secret not set!')
  return process.env.SECRET
}

function getUserId(context) {
  try {
    const token = context.request.cookie.token
    if (token) {
      const { userId } = jwt.verify(token, APP_SECRET, { algorithm: 'HS512' })
      return userId
    }
    throw new Error('Not authenticated')
  }
  catch(err) {
    console.error(err)
  }
}

module.exports = {
  APP_SECRET,
  getUserId,
}
