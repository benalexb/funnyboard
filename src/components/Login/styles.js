import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(10)
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },
  form: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    padding: `0 ${theme.spacing(2)}px 0`,
    width: '100%'
  },
  input: {
    marginBottom: theme.spacing(3),
    maxWidth: '400px',
    width: '100%'
  },
  loginError: {
    marginBottom: theme.spacing(3),
    textAlign: 'center'
  },
  progressBar: {
    marginBottom: theme.spacing(3),
    maxWidth: '400px',
    width: '100%'
  },
  submitButtonWrapper: {
    maxWidth: '400px',
    width: '100%'
  },
  button: {
    height: '56px'
  }
}))

export default useStyles
