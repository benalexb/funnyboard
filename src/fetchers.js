export const baseURL = '/api/graphql'
export const baseConfig = {
  method: 'POST',
  headers: { 'Content-type': 'application/json' }
}

export const userFetcher = (query, id) =>
  fetch(baseURL, {
    ...baseConfig,
    body: JSON.stringify({
      query,
      variables: { id }
    })
  })
    .then((res) => res.json())
    .then((json) => json.data.getUser)

export const boardsFetcher = (query, memberID) =>
  fetch(baseURL, {
    ...baseConfig,
    body: JSON.stringify({
      query,
      variables: { memberID }
    })
  })
    .then((res) => res.json())
    .then((json) => json.data.getBoards)

export const columnsFetcher = (query, board) =>
  fetch(baseURL, {
    ...baseConfig,
    body: JSON.stringify({
      query,
      variables: { board }
    })
  })
    .then((res) => res.json())
    .then((json) => json.data.getColumns)

export const stickieFetcher = (query, column) =>
  fetch(baseURL, {
    ...baseConfig,
    body: JSON.stringify({
      query,
      variables: { column }
    })
  })
    .then((res) => res.json())
    .then((json) => json.data.getStickies)
