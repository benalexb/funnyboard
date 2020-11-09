import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import { getUser } from '../../queries'

const fetcher = (query, id) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { id } })
  })
    .then((res) => res.json())
    .then((json) => json.data)

const HQ = (props) => {
  const [, , removeCookie] = useCookies(['token'])
  const { data } = useSWR([getUser, '5fa8783597e9c42cb36de632'], fetcher, { initialData: props.data })
  const onButtonClick = () => removeCookie('token')

  return (
    <div className="HQ">
      <div>{JSON.stringify(data)}</div>
      <button className='btn btn-blue' onClick={onButtonClick}>
        logout
      </button>
    </div>
  )
}

HQ.propTypes = {
  data: PropTypes.object
}

export default HQ
