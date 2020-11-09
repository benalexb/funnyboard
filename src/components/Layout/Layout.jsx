import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Header from '../Header'
import { useRequireAuth } from '../../hooks'
import styles from './Layout.module.css'

const Layout = ({ children, user }) => {
  useRequireAuth()

  return (
    <div className={styles.root}>
      <div className={styles.headerWrapper}>
        <Header user={user} />
      </div>
      <Container maxWidth={false}>
        {children}
      </Container>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  user: PropTypes.object
}

export default Layout
