import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import { getUser } from '../../queries'
import { userFetcher } from '../../fetchers'

const HQ = ({ user }) => {
  const { data } = useSWR([getUser, user && user._id], userFetcher, { initialData: user })

  return (
    <div className="HQ">
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}

HQ.propTypes = {
  user: PropTypes.object
}

export default HQ
