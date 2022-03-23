import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { validateEmail } from '../../../utils/validators'

export const LoginPage = () => {
  const [emailValidationMessage, SetEmailValidationMessage]       = useState('')
  const [passwordValidationMessage, SetPasswordValidationMessage] = useState('')
  const [formValues, setFormValues]                               = useState({ email: '', password: '' })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const { email, password } = e.target.elements
    
    if (!email.value) {
      SetEmailValidationMessage('The email is required')
    }
    
    if (!password.value) {
      SetPasswordValidationMessage('The password is required')
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
    <form onSubmit={handleSubmit}>
      <TextField
        label="email"
        variant="outlined"
        helperText={emailValidationMessage}
        id="email"
        name={'email'}
        value={formValues.email} onChange={handleOnChange}
        onBlur={handleBlurEmail}
      />
      <TextField
        label="password"
        variant="outlined"
        type="password"
        helperText={passwordValidationMessage}
        id="password"
        name={'password'}
        value={formValues.password}
        onChange={handleOnChange}
      />
      />
      <Button variant="outlined" type="submit">
        Send
      </Button>
    </form>
  </>)
}

export default LoginPage
