import React from 'react'
import PropTypes from 'prop-types'
import absoluteUrl from 'next-absolute-url'
import Layout from '../src/components/Layout'
import HQ from '../src/components/HQ'
import { decodeToken } from '../db/tools/utils'
import { getUser, getBoards } from '../src/queries'

const IndexPage = (props) => (
  <Layout user={props.user}>
    <HQ {...props} />
  </Layout>
)

IndexPage.propTypes = {
  user: PropTypes.object,
  boards: PropTypes.arrayOf(PropTypes.object)
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
        body: JSON.stringify({
          query: getUser,
          variables: { id: userId }
        })
      })

      // Fetch boards
      const boardsResponse = await fetch(host, {
        ...fetchConfigs,
        body: JSON.stringify({
          query: getBoards,
          variables: { memberID: userId }
        })
      })

      const userJSON = await userResponse.json()
      const boardsJSON = await boardsResponse.json()
      propPayload.props = {
        user: userJSON.data.getUser,
        boards: boardsJSON.data.getBoards
      }
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
