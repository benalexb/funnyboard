import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import { getBoards, getColumns } from '../../queries'
import { boardsFetcher, columnsFetcher } from '../../fetchers'
import Column from '../Column'
import styles from './HQ.module.css'

const HQ = (props) => {
  const [selectedBoard, setSelectedBoard] = useState('')

  const { data: boards } = useSWR(
    [getBoards, props.user && props.user._id],
    boardsFetcher,
    { initialData: props.boards }
  )
  const { data: columns } = useSWR(
    selectedBoard.length ? [getColumns, selectedBoard] : null,
    columnsFetcher
  )

  useEffect(
    () => {
      if (!selectedBoard && boards && boards.length) {
        setSelectedBoard(boards[0]._id)
      }
    },
    [boards]
  )

  return (
    <div className={styles.rootHQ}>
      {!!boards && (
        <FormControl className={styles.formControl}>
          <InputLabel htmlFor="age-native-helper">
            Board
          </InputLabel>
          <NativeSelect
            value={selectedBoard}
            onChange={(event) => setSelectedBoard(event.target.value)}
            inputProps={{ name: 'board', id: 'board-selection' }}
          >
            {!!boards && boards.map(({ _id, name }) => {
              return <option key={_id} value={_id}>{name}</option>
            })}
          </NativeSelect>
        </FormControl>
      )}
      <div className={styles.boardPane}>
        {!!columns && columns.map((column) => {
          return <Column key={column._id} column={column} />
        })}
      </div>
    </div>
  )
}

HQ.propTypes = {
  user: PropTypes.object,
  boards: PropTypes.arrayOf(PropTypes.object)
}

export default HQ
