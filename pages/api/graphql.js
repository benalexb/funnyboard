import mongoose, { Types } from 'mongoose'
import { serialize } from 'cookie'
import { ApolloServer, gql, AuthenticationError } from 'apollo-server-micro'
import { getModels } from '../../db/models'
import { isAuthenticated, tokenForUser } from '../../db/tools/utils'
import dbConnectionConfig from '../../db/connectionConfig'

const isDev = process.env.NODE_ENV === 'development'

const typeDefs = gql`
  # USER
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  # BOARD
  type Board {
    _id: ID!
    owner: ID!
    name: String!
    members: [User!]!
  }

  input AddBoardInput {
    owner: ID!
    name: String!
    members: [ID!]!
  }

  input UpdateBoardInput {
    owner: ID
    name: String
    members: [ID]
  }

  # COLUMN
  type Column {
    _id: ID!
    title: String!
    description: String!
    position: Int!
    board: ID!
  }

  input AddColumnInput {
    title: String!
    description: String!
    position: Int!
    board: ID!
  }

  input UpdateColumnInput {
    title: String
    description: String
    position: Int
    board: ID
  }

  # STICKIE
  type Stickie {
    _id: ID!
    title: String!
    description: String!
    position: Int!
    column: ID!
  }

  input AddStickieInput {
    title: String!
    description: String!
    position: Int!
    column: ID!
  }

  input UpdateStickieInput {
    title: String
    description: String
    position: Int
    column: ID
  }

  # MISC
  type LoginResponse {
    token: String!
    user: User!
  }

  type Query {
    login(email: String, password: String): LoginResponse
    getUser(id: ID, email: String): User
    getBoards(id: ID, memberID: ID): [Board]
    getColumns(id: ID, board: ID): [Column]
    getStickies(id: ID, column: ID): [Stickie]
  }

  type Mutation {
    addBoard(board: AddBoardInput): Board
    addColumn(column: AddColumnInput): Column
    addStickie(stickie: AddStickieInput): Stickie

    updateBoard(id: ID!, boardProps: UpdateBoardInput!): Board
    updateColumn(id: ID!, columnProps: UpdateColumnInput!): Column
    updateStickie(id: ID!, stickieProps: UpdateStickieInput!): Stickie

    removeBoard(id: ID!): Board
    removeColumn(id: ID!): Column
    removeStickie(id: ID!): Stickie
  }
`

const requireAuth = (resolver) => (parent, args, context) => {
  if (context.isAuth) {
    return resolver(parent, args, context)
  } else {
    throw new AuthenticationError('invalid token provided')
  }
}

const login = async (parent, args, context) => {
  try {
    const { res, models } = context
    const { email, password: pass } = args

    // Attempt to retrieve user from the database
    const user = await models.User.findOne({ email })
    if (!user) {
      throw new AuthenticationError('unknown user')
    }

    // Determine if retrieved user and password are a match
    const isMatch = await user.comparePasswordAsync(pass)
    if (!user || !isMatch) {
      throw new AuthenticationError('permission denied')
    }

    // Strip password field from the response
    const { password, ...userWithoutPassword } = user.toObject({ getters: true, virtuals: true })

    // Get a token based on the user object
    const token = tokenForUser(user)

    // Store token in the cookie and return in it the response body
    res.setHeader('Set-Cookie', serialize('token', token, { path: '/' }))
    return { token, user: userWithoutPassword }
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getUser = async (parent, args, context) => {
  try {
    const { id: _id, email } = args
    const queryProps = {
      ...(_id && { _id }),
      ...(email && { email })
    }
    return await context.models.User.findOne(queryProps)
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getBoards = async (parent, args, context) => {
  try {
    const { id: _id, memberID } = args
    const queryProps = {
      ...(_id && { _id }),
      ...(memberID && { members: Types.ObjectId(memberID) })
    }
    return await context.models.Board.find(queryProps).populate('members').exec()
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getColumns = async (parent, args, context) => {
  try {
    const { id: _id, board } = args
    const queryProps = {
      ...(_id && { _id }),
      ...(board && { board: Types.ObjectId(board) })
    }
    return await context.models.Column
      .find(queryProps)
      // Sort by position in ascending order
      .sort({ position: 1 })
      .exec()
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const getStickies = async (parent, args, context) => {
  try {
    const { id: _id, column } = args
    const queryProps = {
      ...(_id && { _id }),
      ...(column && { column: Types.ObjectId(column) })
    }
    return await context.models.Stickie
      .find(queryProps)
      // Sort by position in ascending order
      .sort({ position: 1 })
      .exec()
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const addBoard = async (parent, args, context) => {
  try {
    const { board } = args
    const { models } = context
    let newBoard = new models.Board({ ...board })
    newBoard = await newBoard.save()
    return models.Board
      .findOne({ _id: newBoard._id })
      .populate('members')
      .exec()
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

const addColumn = async (parent, args, context) => {
  try {
    const { column } = args
    const { models } = context
    let newColumn = new models.Column({ ...column })
    newColumn = await newColumn.save()
    return models.Column.findOne({ _id: newColumn._id })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

const addStickie = async (parent, args, context) => {
  try {
    const { stickie } = args
    const { models } = context
    let newStickie = new models.Stickie({ ...stickie })
    newStickie = await newStickie.save()
    return models.Stickie.findOne({ _id: newStickie._id })
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

const resolvers = {
  Query: {
    login,
    getUser: requireAuth(getUser),
    getBoards: requireAuth(getBoards),
    getColumns: requireAuth(getColumns),
    getStickies: requireAuth(getStickies)
  },
  Mutation: {
    addBoard: requireAuth(addBoard),
    addColumn: requireAuth(addColumn),
    addStickie: requireAuth(addStickie)
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  debug: isDev,
  context: async (context) => {
    const { cookies, headers } = context.req

    let user
    let isAuth
    let models
    let mongooseConnection

    try {
      // Create a connection to the database
      mongooseConnection = await mongoose.createConnection(
        process.env.DB_CONNECTION || 'mongodb://localhost:27017/funnyboard',
        dbConnectionConfig
      )
      models = getModels(mongooseConnection)

      // First, try extracting the token from the cookie
      let { token } = cookies

      // If no token is retrieved from the cookie, check headers
      if (!token) {
        token = headers.authorization || headers.Authorization
      }

      // Attempt token extraction from request header
      [isAuth, user] = await isAuthenticated(token, models)
    } catch (error) {
      console.error(error)
    }

    return {
      ...context,
      user,
      isAuth,
      models,
      mongooseConnection
    }
  },
  formatResponse: (response, { context }) => {
    // Use this lifecycle method just to clean up things
    if (context.mongooseConnection) {
      context.mongooseConnection.close()
    }
    return response
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
