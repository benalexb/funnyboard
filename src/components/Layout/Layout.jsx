import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import { useRequireAuth } from '../../hooks'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
  useRequireAuth()

  return (
    <div className={styles.root}>
      <div className={styles.headerDivider} />
      <Container>
        {children}
      </Container>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
