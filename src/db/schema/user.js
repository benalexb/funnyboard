import { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

const { Types } = Schema

const userSchema = new Schema({
  email: { type: Types.String, unique: true, lowercase: true },
  password: Types.String,
  firstName: Types.String,
  lastName: Types.String
})

userSchema.virtual('fullName').get((...args) => {
  return `${args[2].firstName} ${args[2].lastName}`
})

// On Save Hook, encrypt password
userSchema.pre('save', function (next) {
  // Get access to the user model
  const user = this

  // generate a salt then run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err) }

    // hash our password using the salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) { return next(err) }

      // Override plain text password with encrypted password
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) { return callback(err) }
    callback(null, isMatch)
  })
}

userSchema.methods.comparePasswordAsync = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      err && reject(err)
      resolve(isMatch)
    })
  })
}

export default userSchema
