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
        <h3>{stickie.title}</h3>
        <p>{stickie.description}</p>
        <p>{stickie.position}</p>
      </Paper>
    </div>
  )
}

Stickie.propTypes = {
  stickie: PropTypes.object
}

export default Stickie
