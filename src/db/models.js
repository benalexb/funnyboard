import userSchema from './schema/user'
import boardSchema from './schema/board'
import columnSchema from './schema/column'
import stickieSchema from './schema/stickie'

export default (mongooseConnection) => {
  return {
    User: mongooseConnection.model('user', userSchema),
    Board: mongooseConnection.model('board', boardSchema),
    Column: mongooseConnection.model('column', columnSchema),
    Stickie: mongooseConnection.model('stickie', stickieSchema)
  }
}
