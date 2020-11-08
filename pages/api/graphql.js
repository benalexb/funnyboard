import { ApolloServer, gql } from 'apollo-server-micro'
// import graphQLTypes from '../../src/graphql/types.gql'

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
    login () {},
    getUser (parent, args, context) {
      console.log('parent', parent) // bbarreto_debug
      console.log('args', args) // bbarreto_debug
      console.log('context', context) // bbarreto_debug
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

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
