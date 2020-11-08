import React from 'react'
import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import { getUser } from '../src/queries'
import Layout from '../src/components/Layout'

const fetcher = (query, id) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } })
  })
    .then((res) => res.json())
    .then((json) => json.data)

const IndexPage = () => {
  const [, , removeCookie] = useCookies(['token'])
  const { data } = useSWR([getUser, '5fa7c193ce683c25192bb959'], fetcher)
  console.log('data', data) // bbarreto_debug

  return (
    <Layout>
      <div>Hey there!</div>
      <button onClick={() => removeCookie('token')}>logout</button>
    </Layout>
  )
}

export default IndexPage
