import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: theme.breakpoints.values.lg
  },
  headerDivider: {
    width: '100%'
  }
}))

export default useStyles
