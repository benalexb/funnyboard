import bcrypt from 'bcryptjs'

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
