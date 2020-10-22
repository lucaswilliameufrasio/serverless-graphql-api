const jwt = require('jsonwebtoken')

const decodedToken = (req, requireAuth = true) => {
  const header = !!req.req
    ? req.req.headers.authorization
    : req.event.headers.authorization

  if (header) {
    const token = header.replace('Bearer ', '')
    const decoded = jwt.verify(token, 'supersecret')

    return decoded
  }

  if (requireAuth) {
    throw new Error('Login in to access resource')
  }

  return null
}

module.exports = { decodedToken }
