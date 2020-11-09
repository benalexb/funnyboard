import React from 'react'
import PropTypes from 'prop-types'
import absoluteUrl from 'next-absolute-url'
import Layout from '../src/components/Layout'
import HQ from '../src/components/HQ'
import { getUser } from '../src/queries'
import { decodeToken } from '../db/tools/utils'

const IndexPage = (props) => (
  <Layout user={props.user}>
    <HQ {...props} />
  </Layout>
)

IndexPage.propTypes = {
  user: PropTypes.object
}

export async function getServerSideProps ({ req, res }) {
  try {
    const { cookies: { token } } = req
    const propPayload = { props: {} }

    if (token) {
      // User is authenticated, so we fetch dependencies
      const { origin } = absoluteUrl(req, req.headers.host)
      const { sub: userId } = decodeToken(token, process.env.CLIENT_SECRET)
      const host = `${origin}/api/graphql`
      const fetchConfigs = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          ...(token ? { Authorization: token } : {})
        }
      }

      // Fetch User
      const userResponse = await fetch(host, {
        ...fetchConfigs,
        body: JSON.stringify({ query: getUser, variables: { id: userId } })
      })
      const userJSON = await userResponse.json()

      // bbarreto_dev: TODO fetch boards and stickies

      propPayload.props = { user: userJSON.data.getUser }
    } else {
      // Redirect to login page if not authenticated
      res.setHeader('location', '/login')
      res.statusCode = 302
      res.end()
    }
    return propPayload
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

export default IndexPage
