export const userFetcher = (query, id) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } })
  })
    .then((res) => res.json())
    .then((json) => json.data)
