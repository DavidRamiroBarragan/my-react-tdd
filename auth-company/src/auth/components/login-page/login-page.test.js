// noinspection JSCheckFunctionSignatures

import { setupServer } from 'msw/node'
import LoginPage from './login-page'
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { handlers } from '../../../mocks/handlers'

const fillInputsWithFireEventsValues = () => {
  const email    = screen.getByLabelText(/email/i)
  const password = screen.getByLabelText(/password/i)
  
  fireEvent.change(email, { target: { value: 'john.doe@test.com' } })
  fireEvent.change(password, { target: { value: '12345' } })
}
const clickSendButton                = () => {
  fireEvent.click(screen.getByRole('button', { name: /send/i }))
}

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.resetHandlers())

describe('LoginPage', () => {
  test('There must be a login page', () => {
    render(<LoginPage/>)
    expect(screen.getByText(/login page/i)).toBeInTheDocument()
  })
  
  test('must have a form with the following fields: email, password and a submit button', () => {
    render(<LoginPage/>)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })
  
  test('The email and password inputs are required', () => {
    render(<LoginPage/>)
    
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the password is required/i)).not.toBeInTheDocument()
  
    clickSendButton()
    
    expect(screen.getByText(/the email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/the password is required/i)).toBeInTheDocument()
  })
  
  test('must not display the required messages', () => {
    render(<LoginPage/>)
    fillInputsWithFireEventsValues()
  
    clickSendButton()
    
    expect(screen.queryByText(/the password is required/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/the email is required/i)).not.toBeInTheDocument()
  })
})

describe('When the user fills and blur the email input with invalid email', () => {
  test('must display a validation message \'The email is invalid. Example: john.doe@email.com\'', () => {
    render(<LoginPage/>)
    const email = screen.getByLabelText(/email/i)
    fireEvent.change(email, { target: { value: 'invalid.email' } })
    fireEvent.blur(email)
    
    expect(screen.getByText(/The email is invalid. Example: john.doe@email.com/)).toBeInTheDocument()
  })
  
  test('when the user fills and blur the email input with valid email', () => {
    render(<LoginPage/>)
    const email = screen.getByLabelText(/email/i)
    fireEvent.change(email, { target: { value: 'invalid.email' } })
    fireEvent.blur(email)
    
    expect(screen.getByText(/The email is invalid. Example: john.doe@email.com/)).toBeInTheDocument()
    
    fireEvent.change(email, { target: { value: 'john.doe@email.com' } })
    fireEvent.blur(email)
    expect(screen.queryByText(/The email is invalid. Example: john.doe@email.com/)).not.toBeInTheDocument()
  })
})

describe('when the user submit the login form with valid data', () => {
  test('must disable the submit button while the dorm page is fetching data', async () => {
    render(<LoginPage/>)
    const sendButton = screen.getByRole('button', { name: /send/i })
    fillInputsWithFireEventsValues()
    clickSendButton()
    
    expect(sendButton).toBeDisabled()
    await waitFor(() => expect(sendButton).not.toBeDisabled())
  })
  test('must be a loading indicator at the top of the form while it is fetching', async () => {
    render(<LoginPage/>)
    expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    fillInputsWithFireEventsValues()
    clickSendButton()
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))
  })
  
})
