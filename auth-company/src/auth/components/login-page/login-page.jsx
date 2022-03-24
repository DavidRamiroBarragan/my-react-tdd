import { Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { validateEmail } from '../../../utils/validators'
import { login } from '../../services'
import { validateForm } from './utils/login-page.utils'

export const LoginPage = () => {
  const [emailValidationMessage, SetEmailValidationMessage]       = useState('')
  const [passwordValidationMessage, SetPasswordValidationMessage] = useState('')
  const [formValues, setFormValues]                               = useState({ email: '', password: '' })
  const [isFetching, setIsFetching]                               = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsFetching(true)
    if (!validateForm(formValues, SetEmailValidationMessage, SetPasswordValidationMessage)) {
      await login()
      setIsFetching(false)
    }
  }
  
  const handleOnChange = ({ target: { value, name } }) => {
    setFormValues(formValues => ({
      ...formValues, [name]: value,
    }))
  }
  
  const handleBlurEmail = () => {
    if (!validateEmail(formValues.email)) {
      SetEmailValidationMessage('The email is invalid. Example: john.doe@email.com',)
      return
    }
    SetEmailValidationMessage('')
  }
  
  return (<>
    <h1>Login page</h1>
    {isFetching && <CircularProgress data-testid="loading-indicator"/>}
    <form onSubmit={handleSubmit}>
      <TextField
        label="email"
        variant="outlined"
        helperText={emailValidationMessage}
        id="email"
        name="email"
        value={formValues.email} onChange={handleOnChange}
        onBlur={handleBlurEmail}
      />
      <TextField
        label="password"
        variant="outlined"
        type="password"
        helperText={passwordValidationMessage}
        id="password"
        name="password"
        value={formValues.password}
        onChange={handleOnChange}
      />
      <Button variant="outlined" type="submit" disabled={isFetching}>
        Send
      </Button>
    </form>
  </>)
}

export default LoginPage
