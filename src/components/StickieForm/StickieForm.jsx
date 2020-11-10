import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import { TwitterPicker } from 'react-color'
import { useFormState } from '../../hooks'
import styles from './StickieForm.module.css'

const COLORS = [
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3'
]

const StickieForm = ({ stickieRecord, onCloseModal }) => {
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
    color: (stickieRecord && stickieRecord.color) || COLORS[0],
    position: (stickieRecord && stickieRecord.position) || new Date().toISOString()
  })
  const [isDeleting, setDeleting] = useState(false)

  console.log(stickieRecord) // bbarreto_debug

  const handleColorChange = ({ hex }) => {
    setValues({ ...values, color: hex })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setPending(true)
    console.log('Form submitted!') // bbarreto_dev
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
  onCloseModal: PropTypes.func
}

export default StickieForm
