import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import Paper from '@material-ui/core/Paper'
import Stickie from '../Stickie'
import { getStickies } from '../../queries'
import { stickieFetcher } from '../../fetchers'
import styles from './Column.module.css'

const Column = ({ column }) => {
  const { data: stickies } = useSWR(
    column ? [getStickies, column._id] : null,
    stickieFetcher
  )

  return (
    <div className={styles.columnRoot}>
      <Paper variant="outlined" classes={{ root: styles.paper }}>
        <div className={styles.header}>
          <h2>{column.title}</h2>
          <p>{column.description}</p>
        </div>
        <div className={styles.body}>
          {!!stickies && !!stickies.length && stickies.map((stickie) => {
            return <Stickie key={stickie._id} stickie={stickie} />
          })}
        </div>
      </Paper>
    </div>
  )
}

Column.propTypes = {
  column: PropTypes.object
}

export default Column
