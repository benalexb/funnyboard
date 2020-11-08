import jwt from 'jwt-simple'
import bcrypt from 'bcryptjs'

const { CLIENT_SECRET } = process.env
const DEV_SECRET = 'THIS_IS_AN_UNSAFE_SECRET'

export const getPasswordHash = (plainTextPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { reject(err) }
      bcrypt.hash(plainTextPassword, salt, (err, hash) => {
        if (err) { reject(err) }
        resolve(hash)
      })
    })
  })
}

export const resetModelCollection = async (model) => {
  const removal = await model.deleteMany({})
  console.log(`Removed ${removal.deletedCount} ${model.modelName} records`)
  return removal
}

export const tokenForUser = function (user) {
  const timestamp = new Date().getTime()
  const payload = { sub: user.id, iat: timestamp }
  return jwt.encode(payload, CLIENT_SECRET || DEV_SECRET)
}

export const decodeToken = function (token) {
  return jwt.decode(token, CLIENT_SECRET || DEV_SECRET)
}

export const isAuthenticated = async (token, models) => {
  let user
  let isValid = false
  if (token) {
    const { sub: userId } = decodeToken(token)
    user = await models.User.findById(userId)
    isValid = !!user
  }
  return [isValid, user]
}
