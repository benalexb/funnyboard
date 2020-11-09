import React from 'react'
import { useCookies } from 'react-cookie'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import styles from './Header.module.css'

const Header = () => {
  const [, , removeCookie] = useCookies(['token'])
  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={styles.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            News
          </Typography>
          <Button color="inherit" onClick={() => removeCookie('token')}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
