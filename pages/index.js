import React from 'react'
import absoluteUrl from 'next-absolute-url'
import Layout from '../src/components/Layout'
import HQ from '../src/components/HQ'
import { getUser } from '../src/queries'

const IndexPage = (props) => (
  <Layout>
    <HQ {...props} />
  </Layout>
)

export async function getServerSideProps ({ req }) {
  try {
    const { cookies: { token } } = req
    const { origin } = absoluteUrl(req, req.headers.host)

    const response = await fetch(`${origin}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: token },
      body: JSON.stringify({ query: getUser, variables: { id: '5fa8783597e9c42cb36de632' } })
    })
    const json = await response.json()

    return { props: { data: json.data } }
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

export default IndexPage
