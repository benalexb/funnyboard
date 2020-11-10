import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { mutate } from 'swr'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import { TwitterPicker } from 'react-color'
import { useFormState } from '../../hooks'
import { getStickies } from '../../queries'
import { updateStickie, addStickie } from '../../mutations'
import { baseURL, baseConfig } from '../../fetchers'
import { COLORS } from '../../../db/tools/data'
import styles from './StickieForm.module.css'

const StickieForm = ({ columns, stickieRecord, onCloseModal, originColumn }) => {
  const {
    errors,
    pending,
    // setErrors,
    setPending,
    setValues,
    values
  } = useFormState({
    title: (stickieRecord && stickieRecord.title) || '',
    description: (stickieRecord && stickieRecord.description) || '',
    column: (stickieRecord && stickieRecord.column) || originColumn,
    color: (stickieRecord && stickieRecord.color) || COLORS[0],
    position: (stickieRecord && stickieRecord.position) || new Date().toISOString()
  })
  const [isDeleting, setDeleting] = useState(false)

  const handleColorChange = ({ hex }) => {
    setValues({ ...values, color: hex })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setPending(true)

    try {
      if (stickieRecord) {
        // A record is being updated. Issue a request to update the stickie
        await fetch(baseURL, {
          ...baseConfig,
          body: JSON.stringify({
            query: updateStickie,
            variables: {
              id: stickieRecord._id,
              stickieProps: { ...values }
            }
          })
        })

        // Trigger a revalidation (refetch) of stickies for this particular column
        mutate([getStickies, stickieRecord.column])

        if (stickieRecord.column !== values.column) {
          // Column has been updated, so we must trigger a revalidation for the new column as well
          mutate([getStickies, values.column])
        }
      } else {
        // A record is being created. Issue a request to create a stickie
        await fetch(baseURL, {
          ...baseConfig,
          body: JSON.stringify({
            query: addStickie,
            variables: { stickie: { ...values } }
          })
        })
        mutate([getStickies, values.column])
      }
      onCloseModal()
    } catch (error) {
      console.error(error)
      setPending(false)
    }
  }

  const onDeleteAttempt = (event) => {
    event.preventDefault()
    setDeleting(true)
  }

  const onDelete = () => {
    console.log('Trying to delete...') // bbarreto_dev
  }

  return (
    <div className={styles.stickieFormRoot}>
      <div className={styles.formTitle}>
        <Typography variant='h5' component='h2'>
          {stickieRecord ? 'Edit Stickie' : 'Create Stickie'}
        </Typography>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <TextField
          classes={{ root: styles.input }}
          type='text'
          name='title'
          label='title'
          disabled={pending}
          error={!!errors && !!errors.title}
          helperText={(errors && errors.title) || null}
          onChange={(event) => setValues({ ...values, title: event.target.value })}
          value={values.title}
          variant='outlined'
        />
        <TextField
          multiline
          classes={{ root: styles.input }}
          type='text'
          name='description'
          label='Description'
          disabled={pending}
          error={!!errors && !!errors.description}
          helperText={(errors && errors.description) || null}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          value={values.description}
          variant='outlined'
        />
        <FormControl classes={{ root: styles.input }}>
          <InputLabel htmlFor='owner-select'>Column</InputLabel>
          <Select
            native
            disabled={pending}
            value={values.column}
            onChange={(event) => setValues({ ...values, column: event.target.value })}
            inputProps={{ name: 'owner', id: 'owner-select' }}
          >
            {
              columns.map(({ _id, title }) => (
                <option key={_id} value={_id}>
                  {title}
                </option>
              ))
            }
          </Select>
        </FormControl>
        <div className={styles.colorPicker}>
          <TwitterPicker
            triangle="hide"
            color={values.color}
            colors={COLORS}
            onChange={handleColorChange}
            style={{ justifyContent: 'center' }}
          />
        </div>
        <div className={clsx(styles.loaderWrapper, { [styles.hidden]: !pending })}>
          <LinearProgress />
        </div>
        <div className={styles.actionPane}>
          {!isDeleting && (
            <Button
              classes={{ root: styles.actionButton }}
              variant='contained'
              type='submit'
              disabled={
                pending ||
                !values.title.length ||
                !values.description.length ||
                !values.color ||
                !values.position.length
              }
            >
              {stickieRecord ? 'Save' : 'Create'}
            </Button>
          )}
            <Button
              classes={{ root: styles.actionButton }}
              onClick={onCloseModal}
              variant='outlined'
              type='button'
            >
              Cancel
            </Button>
            {!isDeleting && (
              <Button
                classes={{ root: styles.actionButton }}
                onClick={onDeleteAttempt}
                type='button'
              >
                Delete
              </Button>
            )}
            {isDeleting && (
              <Button
                classes={{ root: clsx(styles.actionButton, styles.permDeleteButton) }}
                onClick={onDelete}
                type='button'
                variant='contained'
              >
                Yes, remote it
              </Button>
            )}
        </div>
      </form>
    </div>
  )
}

StickieForm.propTypes = {
  stickieRecord: PropTypes.object,
  onCloseModal: PropTypes.func,
  originColumn: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.object)
}

export default StickieForm
