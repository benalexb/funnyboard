export const login = `
  query login($email: String, $password: String) {
    login(email: $email, password: $password) {
        token
        user {
            _id
            firstName
            lastName
            email
        }
    }
  }
`

export const getUser = `
  query getUser($id: ID, $email: String){
    getUser(id: $id, email: $email) {
      _id
      firstName
      lastName
      email
    }
  }
`

export const getBoards = `
  query getBoards($id: ID, $memberID: ID) {
    getBoards(id: $id, memberID: $memberID) {
      _id
      owner
      name
      members {
        _id
        firstName
        lastName
      }
    }
  }
`

export const getColumns = `
  query getColumns($id: ID, $board: ID) {
    getColumns(id: $id, board: $board) {
      _id
      title
      description
      position
      board
    }
  }
`

export const getStickies = `
  query getStickies($id: ID, $column: ID) {
    getStickies(id: $id, column: $column) {
        _id
        title
        description
        column
        position
    }
  }
`
