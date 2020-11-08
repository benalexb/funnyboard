import mongoose from 'mongoose'
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
    getBoard(id: ID, memberID: ID): Board
    getColumn(id: ID, board: ID): Column
    getStickie(id: ID, column: ID): Stickie
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

const resolvers = {
  Query: {
    login: async (parent, args, context) => {
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
    },
    getUser (parent, args, context) {
      console.log('context.isAuth', context.isAuth) // bbarreto_debug
      console.log('context.user', context.user) // bbarreto_debug
      return {
        _id: '123fasfasdf',
        firstName: 'dfasd f',
        lastName: 'asdfasdfa',
        email: 'dfasdf'
      }
    },
    getBoard () {},
    getColumn () {},
    getStickie () {}
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  debug: isDev,
  context: async (context) => {
    const { cookies, headers, body } = context.req

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

      // Still without a token, check the request body as a last resort
      if (!token) {
        token = body.token
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
    const { mongooseConnection } = context
    mongooseConnection && mongooseConnection.close()
    return response
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
