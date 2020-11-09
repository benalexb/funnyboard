import React from 'react'
import PropTypes from 'prop-types'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { useRouterLoader } from '../../hooks'
import styles from './PageLoader.module.css'

const PageLoader = ({ loading }) => {
  const isLoading = typeof loading === 'undefined' ? useRouterLoader() : loading

  return (
    <Backdrop className={styles.backdrop} open={isLoading}>
      <CircularProgress color='inherit' classes={{ root: styles.loader }} />
    </Backdrop>
  )
}

PageLoader.propTypes = {
  loading: PropTypes.bool
}

export default PageLoader
