import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'
import Column from '../Column'
import StickieForm from '../StickieForm'
import { getBoards, getColumns } from '../../queries'
import { boardsFetcher, columnsFetcher } from '../../fetchers'
import styles from './HQ.module.css'

const HQ = (props) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState('')
  const [selectedStickie, setSelectedStickie] = useState(null)
  const [originColumn, setOriginColumn] = useState(null)

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

  const onCloseModal = () => {
    setModalOpen(false)
    setOriginColumn(null)
    setSelectedStickie(null)
  }

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
        {!!columns && columns.map((column) => (
          <Column
            key={column._id}
            column={column}
            onCloseModal={onCloseModal}
            setModalOpen={setModalOpen}
            setOriginColumn={setOriginColumn}
            setSelectedStickie={setSelectedStickie}
          />
        ))}
      </div>
      <Modal
        className={styles.modal}
        open={isModalOpen}
        onClose={onCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 125 }}
      >
        <Fade in={isModalOpen}>
          <Paper classes={{ root: styles.modalPaper }}>
            <StickieForm
              columns={columns}
              originColumn={originColumn}
              stickieRecord={selectedStickie}
              onCloseModal={onCloseModal}
            />
          </Paper>
        </Fade>
      </Modal>
    </div>
  )
}

HQ.propTypes = {
  user: PropTypes.object,
  boards: PropTypes.arrayOf(PropTypes.object)
}

export default HQ
