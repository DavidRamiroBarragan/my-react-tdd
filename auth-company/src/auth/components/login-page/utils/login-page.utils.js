export const validateForm = ({ email, password }, setEmailValidationMessage, setPasswordValidationMessage) => {
  const isEmailEmpty    = !email
  const isPasswordEmpty = !password
  
  if (isEmailEmpty) {
    setEmailValidationMessage('The email is required')
  }
  
  if (isPasswordEmpty) {
    setPasswordValidationMessage('The password is required')
  }
  
  return isEmailEmpty || isPasswordEmpty
  
}