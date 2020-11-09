import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import { getBoards, getColumns } from '../../queries'
import { boardsFetcher, columnsFetcher } from '../../fetchers'
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

  console.log('------------') // bbarreto_debug
  console.log('props.user', props.user) // bbarreto_debug
  console.log('columns', columns) // bbarreto_debug

  return (
    <div className="HQ">
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
      <ul>
        {!!columns && columns.map((column) => {
          return (
            <li key={column._id}>
              <span>{column.title}</span>
              <span> - {column.description}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

HQ.propTypes = {
  user: PropTypes.object,
  boards: PropTypes.arrayOf(PropTypes.object)
}

export default HQ
