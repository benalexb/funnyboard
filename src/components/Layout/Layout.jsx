import React from 'react'
import PropTypes from 'prop-types'
import Container from '@material-ui/core/Container'
import Header from '../Header'
import { useRequireAuth } from '../../hooks'
import styles from './Layout.module.css'

const Layout = (props) => {
  useRequireAuth()

  return (
    <div className={styles.root}>
      <div className={styles.headerWrapper}>
        <Header />
      </div>
      <Container>
        {props.children}
      </Container>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
