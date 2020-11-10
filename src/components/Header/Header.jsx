import React from 'react'
import PropTypes from 'prop-types'
import { useCookies } from 'react-cookie'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import styles from './Header.module.css'

const Header = ({ user }) => {
  const [, , removeCookie] = useCookies(['token'])
  return (
    <div className={styles.root}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography id="app-header" variant="h6" className={styles.title}>
            { user ? `${user.firstName} ${user.lastName}` : null }
          </Typography>
          <Button color="inherit" onClick={() => removeCookie('token')}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

Header.defaultProps = {
  user: null
}

Header.propTypes = {
  user: PropTypes.object
}

export default Header
