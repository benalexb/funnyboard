import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/router'

export const useRequireAuth = (redirectUrl = '/login') => {
  const router = useRouter()
  const [cookies] = useCookies(['token'])

  // If there is no token, user is not logged in.
  useEffect(() => {
    if (!cookies.token) {
      router.push(redirectUrl)
    }
  }, [cookies])

  return [cookies.token]
}

export const useFormState = (initialState = {}) => {
  const [errors, setErrors] = useState({})
  const [pending, setPending] = useState(false)
  const [values, setValues] = useState(initialState)

  return {
    errors,
    pending,
    setErrors,
    setPending,
    setValues,
    values
  }
}

export const useRouterLoader = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = (url) => (url !== router.pathname) && setLoading(true)
    const handleComplete = (url) => (url !== router.pathname) && setLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [])
  return loading
}
