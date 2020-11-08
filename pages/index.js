import React from 'react'
import useSWR from 'swr'

const fetcher = (body) =>
  fetch('/api/graphql', {
    body,
    method: 'POST',
    headers: { 'Content-type': 'application/json' }
  })
    .then((res) => res.json())
    .then((json) => json.data)

const userQuery = `
  query getUser($id: ID){
    getUser(id: $id) {
      _id
    }
  }
`

export default function Index () {
  const fetcherKey = JSON.stringify({
    query: userQuery,
    variables: { id: 'this_is_a_test' }
  })
  const { data, error } = useSWR(fetcherKey, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const { getUser: user } = data
  console.log(user) // bbarreto_debug

  return (
    <div>
      Hey there!
    </div>
  )
}
