import React from 'react'
import Container from '@material-ui/core/Container'
import { useRequireAuth } from '../../hooks'
import useStyles from './styles'

const Layout = ({ children }) => {
  const classes = useStyles()
  const [token] = useRequireAuth()

  if (!token) {
    return null
  }

  return (
    <div className={classes.root}>
      <div className={classes.headerDivider} />
      <Container>
        {children}
      </Container>
    </div>
  )
}

export default Layout
