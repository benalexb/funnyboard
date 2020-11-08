import React, { useEffect } from 'react'
import clsx from 'clsx'
import useSWR from 'swr'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useFormState } from '../../hooks'
import { login as loginQuery } from '../../queries'
import useStyles from './styles'

const loginFetcher = (query, email, password) =>
  fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ query, variables: { email, password } })
  })
    .then((res) => res.json())

export const validateForm = (values) => {
  let isValid = true
  const errors = {}

  if (!values.email || !values.password) {
    errors.email = 'Required'
    errors.password = 'Required'
    isValid = false
  }

  if (!errors.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
    isValid = false
  }

  return { isValid, errors }
}

const onSubmit = (event, values, config) => {
  event.preventDefault()
  const { isValid, errors } = validateForm(values)
  if (isValid) {
    config.setPending(true)
  } else {
    config.setErrors(errors)
  }
}

const LoginError = () => {
  const classes = useStyles()
  return (
    <div className={classes.loginError}>
      <Typography variant='caption' color='error'>
        please check your credentials
      </Typography>
    </div>
  )
}

const LoginForm = () => {
  const router = useRouter()
  const classes = useStyles()
  const [cookies, setCookie] = useCookies(['token'])

  const {
    errors,
    pending,
    setErrors,
    setPending,
    setValues,
    values
  } = useFormState({ email: '', password: '' })

  const loginFetcherKey = pending ? [loginQuery, values.email, values.password] : null
  const { data: loginResponse, error: loginError } = useSWR(loginFetcherKey, loginFetcher)

  useEffect(
    () => {
      if (loginError || (loginResponse && loginResponse.errors)) {
        setErrors({ auth: true })
        setPending(false)
      } else if (loginResponse && loginResponse.data) {
        if (!cookies.token) {
          setCookie('token', loginResponse.data.login.token)
        }
        router.push('/')
        setPending(false)
      }
    },
    [loginResponse, loginError]
  )

  const onChange = (key, value) => {
    setValues({ ...values, [key]: value })
  }

  return (
    <div className={clsx('login-container', classes.root)}>
      <Typography variant='h4' classes={{ h4: classes.title }}>
        Sign In
      </Typography>
      <form
        className={classes.form}
        onSubmit={(event) => onSubmit(event, values, { setErrors, setPending })}
      >
        <TextField
          classes={{ root: classes.input }}
          type='email'
          name='email'
          placeholder='email'
          disabled={pending}
          error={!!(errors && errors.email)}
          helperText={(errors && errors.email) || null}
          onChange={(event) => onChange('email', event.target.value)}
          value={values.email}
          variant='outlined'
        />
        <TextField
          classes={{ root: classes.input }}
          type='password'
          name='password'
          placeholder='password'
          disabled={pending}
          error={!!(errors && errors.password)}
          helperText={(errors && errors.password) || null}
          onChange={(event) => onChange('password', event.target.value)}
          value={values.password}
          variant='outlined'
        />
        {!pending && !!errors && !!errors.auth && <LoginError />}
        {pending && (
          <div className={classes.progressBar}>
            <LinearProgress />
          </div>
        )}
        <div className={classes.submitButtonWrapper}>
          <Button
            fullWidth
            classes={{ root: classes.button }}
            color='primary'
            variant='contained'
            type='submit'
            disabled={pending}
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
