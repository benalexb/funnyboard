import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import { getUser, getBoards } from '../../queries'
import { userFetcher, boardsFetcher } from '../../fetchers'

const HQ = (props) => {
  const { data: user } = useSWR(
    [getUser, props.user && props.user._id],
    userFetcher,
    { initialData: props.user }
  )
  const { data: boards } = useSWR(
    [getBoards, props.user && props.user._id],
    boardsFetcher,
    { initialData: props.boards }
  )

  return (
    <div className="HQ">
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(boards)}</div>
    </div>
  )
}

HQ.propTypes = {
  user: PropTypes.object,
  boards: PropTypes.arrayOf(PropTypes.object)
}

export default HQ
