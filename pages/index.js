import React from 'react'
import useSWR from 'swr'
import { getUser } from '../src/queries'

const fetcher = (query, id) => {
  console.log(JSON.stringify({ query, variables: { id } })) // bbarreto_debug
  return fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZmE3YzE5M2NlNjgzYzI1MTkyYmI5NTkiLCJpYXQiOjE2MDQ4NTg5NDc3NTR9.tktd1k23BUXnMAgckjdGcSftoviEt5GlKPw78qkKzts'
    },
    body: JSON.stringify({ query, variables: { id } })
  })
    .then((res) => res.json())
    .then((json) => json.data)
}

export default function Index () {
  const { data, error } = useSWR([getUser, '5fa7c193ce683c25192bb959'], fetcher)

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
