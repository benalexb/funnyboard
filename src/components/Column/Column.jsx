import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import styles from './Column.module.css'

const Column = ({ column }) => {
  console.log('props.column', column) // bbarreto_debug
  return (
    <div className={styles.columnRoot}>
      <Paper variant="outlined" classes={{ root: styles.paper }}>
        <div className={styles.columnRoot}>
          <div className={styles.header}>
            <h2>{column.title}</h2>
            <p>{column.description}</p>
            <p>{column.position}</p>
          </div>
          <div className={styles.body}>
            Stickies...
          </div>
        </div>
      </Paper>
    </div>
  )
}

Column.propTypes = {
  column: PropTypes.object
}

export default Column
