import { Button, CircularProgress, TextField } from '@mui/material'
import { useState } from 'react'
import { validateEmail } from '../../../utils/validators'
import { login } from '../../services'
import { validateForm } from './utils/login-page.utils'
import Snackbar from '@mui/material/Snackbar'

export const LoginPage = () => {
  const [emailValidationMessage, SetEmailValidationMessage]       = useState('')
  const [passwordValidationMessage, SetPasswordValidationMessage] = useState('')
  const [formValues, setFormValues]                               = useState({ email: '', password: '' })
  const [isFetching, setIsFetching]                               = useState(false)
  const [snackbarError, setSnackbarError]                         = useState({ opened: false, message: '' })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm(formValues, SetEmailValidationMessage, SetPasswordValidationMessage)) {
      try {
        setIsFetching(true)
        const response = await login()
        if (!response.ok) {
          throw response
        }
      } catch (error) {
        const data =  await error.json()
        console.log(data)
        setSnackbarError({ opened: true, message: data.message })
      } finally {
        setIsFetching(false)
      }
    }
    
  }
  
  const handleOnChange = ({ target: { value, name } }) => {
    setFormValues(form => ({
      ...form, [name]: value,
    }))
  }
  
  const handleBlurEmail = () => {
    if (!validateEmail(formValues.email)) {
      SetEmailValidationMessage('The email is invalid. Example: john.doe@email.com',)
      return
    }
    SetEmailValidationMessage('')
  }
  
  function oncloseSnackbar () {
    setSnackbarError({ opened: false, message: '' })
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
    <Snackbar
      message={snackbarError.message}
      open={snackbarError.opened}
      autoHideDuration={3000}
      onClose={oncloseSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    />
  </>)
}

export default LoginPage
