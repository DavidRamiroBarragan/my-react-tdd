import { Button, TextField } from '@mui/material'
import { useState } from 'react'

export const LoginPage = () => {
  const [emailValidationMessage, SetEmailValidationMessage] = useState('')
  const [passwordValidationMessage, SetPasswordValidationMessage] = useState('')

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
  return (<>
    <h1>Login page</h1>
    <form onSubmit={handleSubmit}>
      <TextField label="email" variant="outlined" helperText={emailValidationMessage} id="email"/>
      <TextField
        label="password"
        variant="outlined"
        type="password"
        helperText={passwordValidationMessage}
        id="password"
      />
      <Button variant="outlined" type="submit">
        Send
      </Button>
    </form>
  </>)
}

export default LoginPage
