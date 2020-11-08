import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    alignItems: 'end'
  },
  loader: {
    marginTop: '30%'
  }
}))

export default useStyles
