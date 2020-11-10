import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import styles from './Stickie.module.css'

const Stickie = ({ stickie }) => {
  console.log('stickie', stickie)
  return (
    <div className={styles.stickieRoot}>
      <Paper
        elevation={1}
        classes={{ root: styles.paper }}
        style={{ backgroundColor: stickie.color }}
      >
        <h3 className={styles.title}>
          {stickie.title}
        </h3>
        <p className={styles.description}>
          {stickie.description}
        </p>
        <p className={styles.timeStamp}>
          {new Date(stickie.position).toLocaleString()}
        </p>
      </Paper>
    </div>
  )
}

Stickie.propTypes = {
  stickie: PropTypes.object
}

export default Stickie
