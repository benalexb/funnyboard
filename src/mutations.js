export const addBoard = `
  mutation addBoard($board: AddBoardInput) {
    addBoard(board: $board) {
        _id
        name
        owner
        members {
          _id
          firstName
          lastName
        }
    }
  }
`

export const addColumn = `
  addColumn($column: AddColumnInput) {
    addColumn(column: $column) {
      _id
      title
      description
      position
      board
    }
  }
`

export const addStickie = `
  addStickie($stickie: AddStickieInput) {
    addStickie(stickie: $stickie) {
      _id
      title
      description
      position
      column
    }
  }
`

export const updateBoard = `
  mutation updateBoard($id: ID!, $boardProps: UpdateBoardInput!) {
    updateBoard(id: $id, boardProps: $boardProps) {
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

export const updateColumn = `
  mutation updateColumn($id: ID!, $columnProps: UpdateColumnInput!) {
    updateColumn(id: $id, columnProps: $columnProps) {
      _id
      title
      description
      position
      board
    }
  }
`

export const updateStickie = `
  mutation updateStickie($id: ID!, $stickieProps: UpdateStickieInput!) {
    updateStickie(id: $id, stickieProps: $stickieProps) {
      _id
      title
      description
      position
      column
    }
  }
`
