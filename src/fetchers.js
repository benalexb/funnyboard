const baseURL = '/api/graphql'
const baseConfig = {
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

export const boardsFetcher = (query, id) =>
  fetch(baseURL, {
    ...baseConfig,
    body: JSON.stringify({
      query,
      variables: { memberID: id }
    })
  })
    .then((res) => res.json())
    .then((json) => json.data.getBoards)
