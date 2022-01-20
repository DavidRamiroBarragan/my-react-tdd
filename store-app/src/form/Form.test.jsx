import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { Form } from './Form'
import HTTP_STATUS from '../consts/httpStatus'

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
})

describe('when the component is mounted', () => {
  it('should be a create product form page.', function () {
    expect(
      screen.getByRole('heading', { name: /create product/i }),
    ).toBeInTheDocument()
  })
  it('should exist the fields: name, size, type (electronic, furniture, clothing)', function () {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument()
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

    fireEvent.blur(screen.getByLabelText(/name/i), {
      target: { name: 'name', value: '' },
    })

    expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
  })

  it('should display validation message for the input size', () => {
    expect(screen.queryByText(/The size is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/size/i), {
      target: { name: 'size', value: '' },
    })

    expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
  })

  it('should display validation message for the input type', () => {
    expect(screen.queryByText(/The type is required/i)).not.toBeInTheDocument()

    fireEvent.blur(screen.getByLabelText(/type/i), {
      target: { name: 'type', value: '' },
    })

    expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
  })
});

describe('when the user sybmits the form', () => {
  it('should the Button by disabled until the request is done', async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i })

    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(submitButton).not.toBeDisabled())
  })

  it('the form page must display the success message “Product stored” and clean the fields values', async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i })

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: {
        name: 'name',
        value: 'My product',
      },
    })

    fireEvent.change(screen.getByLabelText(/size/i), {
      target: {
        name: 'size',
        value: '10',
      },
    })

    fireEvent.change(screen.getByLabelText(/type/i), {
      target: {
        name: 'type',
        value: 'electronic',
      },
    })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()

    await waitFor(() => expect(screen.queryByText(/product stored/i)).toBeInTheDocument())

  })
})