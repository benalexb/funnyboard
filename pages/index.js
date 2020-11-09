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

export async function getServerSideProps ({ req, res }) {
  try {
    const { cookies: { token } } = req
    const propPayload = { props: {} }

    if (!token) {
      // Redirect to login page if not authenticated
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
    } else {
      // User is authenticated, so we fetch dependencies
      const { origin } = absoluteUrl(req, req.headers.host)
      const response = await fetch(`${origin}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          ...(token ? { Authorization: token } : {})
        },
        body: JSON.stringify({ query: getUser, variables: { id: '5fa8783597e9c42cb36de632' } })
      })
      const json = await response.json()
      propPayload.props = { data: json.data }
    }
    return propPayload
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

export default IndexPage
