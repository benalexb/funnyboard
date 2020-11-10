import React from 'react'
import PropTypes from 'prop-types'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import styles from './AddButton.module.css'

const AddButton = ({ onClick }) => {
  return (
    <Fab
      aria-label="add"
      size="small"
      classes={{ root: styles.addButtonRoot }}
      onClick={(event) => onClick && onClick(event)}
    >
      <AddIcon classes={{ root: styles.icon }} />
    </Fab>
  )
}

AddButton.defaultProps = {
  onClick: () => {}
}

AddButton.propTypes = {
  onClick: PropTypes.func
}

export default AddButton
