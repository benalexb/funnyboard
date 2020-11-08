import React from 'react'
import PropTypes from 'prop-types'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { useRouterLoader } from '../../hooks'
import useStyles from './styles'

const PageLoader = ({ loading }) => {
  const classes = useStyles()
  // bbarreto_dev: this logic can be improved
  const isLoading = typeof loading === 'undefined' ? useRouterLoader() : loading

  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress color='inherit' classes={{ root: classes.loader }} />
    </Backdrop>
  )
}

PageLoader.propTypes = {
  loading: PropTypes.bool
}

export default PageLoader
