import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import Paper from '@material-ui/core/Paper'
import Stickie from '../Stickie'
import AddButton from '../AddButton'
import { getStickies } from '../../queries'
import { stickieFetcher } from '../../fetchers'
import styles from './Column.module.css'

const Column = ({ column, setModalOpen, setOriginColumn, setSelectedStickie }) => {
  const { data: stickies } = useSWR(
    column ? [getStickies, column._id] : null,
    stickieFetcher
  )

  const handleButtonClick = () => {
    setOriginColumn(column._id)
    setSelectedStickie(null)
    setModalOpen(true)
  }

  const handleStickieClick = (stickie) => {
    setSelectedStickie(stickie)
    setModalOpen(true)
  }

  return (
    <div className={styles.columnRoot}>
      <Paper variant="outlined" classes={{ root: styles.paper }}>
        <div className={styles.addButton}>
          <AddButton onClick={handleButtonClick} />
        </div>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {column.title}
          </h2>
          <p className={styles.description}>
            {column.description}
          </p>
        </div>
        <div className={styles.body}>
          {!!stickies && !!stickies.length && stickies.map((stickie) => (
            <Stickie
              key={stickie._id}
              stickie={stickie}
              onStickieClick={handleStickieClick}
            />
          ))}
        </div>
      </Paper>
    </div>
  )
}

Column.propTypes = {
  column: PropTypes.object,
  setModalOpen: PropTypes.func,
  setOriginColumn: PropTypes.func,
  setSelectedStickie: PropTypes.func
}

export default Column
