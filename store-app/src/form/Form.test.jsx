import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Form } from './Form'
import HTTP_STATUS, { INVALID_REQUEST_STATUS } from '../consts/httpStatus'

let nameInput
let typeSelect
let sizeInput
let submitButton

const server = setupServer(
  rest.post('/products', (request, response, ctx) => {
    const { name, size, type } = request.body
    if (name && size && type) {
      return response(ctx.status(HTTP_STATUS.CREATED_STATUS))
    }

    return response(ctx.status(HTTP_STATUS.ERROR_SEVER_STATUS))
  }),
)

// Enable Api mocking before tests.
beforeAll(() => {
  server.listen()
})
// Reset any runtime request handler we may add during the tests.
afterEach(() => {server.resetHandlers()})

// Disable API mocking after the tests are done.
afterAll(() => {server.close()})

// Mount the component before throw each test.
beforeEach(() => {
  render(<Form/>)
  nameInput    = screen.getByLabelText(/name/i)
  typeSelect   = screen.getByLabelText(/type/i)
  sizeInput    = screen.getByLabelText(/size/i)
  submitButton = screen.getByRole('button', { name: /submit/i })
})

describe('when the component is mounted', () => {
  it('should be a create product form page.', function () {
    expect(
      screen.getByRole('heading', { name: /create product/i }),
    ).toBeInTheDocument()
  })
  it('should exist the fields: name, size, type (electronic, furniture, clothing)', function () {
    expect(nameInput).toBeInTheDocument()
    expect(sizeInput).toBeInTheDocument()
    expect(typeSelect).toBeInTheDocument()
    expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
  })
  it('should exists the submit button', () => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })
});

describe('when the use submits the form without values', () => {
  it('should display validation messages', async () => {
    expect(screen.queryByText(/The name is required/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
      expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
      expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
    })
  })
})

describe("when the user blurs an empty field", () => {
  it('should display validation message for the input name', () => {
    expect(screen.queryByText(/The name is required/i)).not.toBeInTheDocument()

    fireEvent.blur(nameInput, {
      target: { name: 'name', value: '' },
    })

    expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
  })

  it('should display validation message for the input size', () => {
    expect(screen.queryByText(/The size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(sizeInput, {
      target: { name: 'size', value: '' },
    })

    expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
  })

  it('should display validation message for the input type', () => {
    expect(screen.queryByText(/The type is required/i)).not.toBeInTheDocument()

    fireEvent.blur(typeSelect, {
      target: { name: 'type', value: '' },
    })

    expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
  })
});

describe('when the user submits the form properly and the server returns created status', () => {
  it('should the Button by disabled until the request is done', async () => {

    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(submitButton).not.toBeDisabled())
  })

  it('the form page must display the success message “Product stored” and clean the fields values', async () => {

    fireEvent.change(nameInput, {
      target: {
        name: 'name',
        value: 'My product',
      },
    })

    fireEvent.change(sizeInput, {
      target: {
        name: 'size',
        value: '10',
      },
    })

    fireEvent.change(typeSelect, {
      target: {
        name: 'type',
        value: 'electronic',
      },
    })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(screen.queryByText(/product stored/i)).toBeInTheDocument())

    expect(nameInput).toHaveValue('')
    expect(sizeInput).toHaveValue('')
    expect(typeSelect).toHaveValue('')

  })
})

describe('when submit the form and the server return and unexpected messages', () => {
  it('the form page must display the error message "Unexpected error, please try again"', async () => {
    fireEvent.click(submitButton)
    await waitFor(() => expect(screen.getByText(/unexpected error, please try again/i)).toBeInTheDocument())
  })
})

describe('when te user submits the form and the server returns and invalid request error', () => {
  it('the form page must display the error message "The form is invalid, the fields [field1...fieldN]"', async () => {
    server.use(
      rest.post('/products', (req, resp, ct) => {
        return resp(
          ct.status(INVALID_REQUEST_STATUS),
          ct.json({ message: 'The form is invalid, the fields name, size, type are required' }),
        )
      })
    )

    fireEvent.click(submitButton)
    await waitFor(() => expect(screen.getByText(/the form is invalid, the fields name, size, type are required/i))
      .toBeInTheDocument())
  })
})

describe('when te user submits the form and the server returns and invalid request error', () => {
  it('the form page must display the error message "Connection error, please try again"', async () => {
    server.use(
      rest.post('/products', (req, resp) => resp.networkError("Failed to connect to server"))
    )

    fireEvent.click(submitButton)
    await waitFor(() => expect(screen.getByText(/connection error, please try again/i))
      .toBeInTheDocument())
  })
})