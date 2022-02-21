import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { handlePaginated } from '../../__fixtures__/handlers'
import { makeFakeError, makeFakeRepo, makeFakeResponse } from '../../__fixtures__/repos'

import { OK_STATUS, UNEXPECTED_STATUS, UNPROCESSABLE_STATUS } from '../../consts'

import { GitHubSearchPage } from './github-serach-page'

let searchButton
const fakeResponse = makeFakeResponse({ totalCount: 8643 })
const fakeRepo = makeFakeRepo()
fakeResponse.items = [fakeRepo]

const server = setupServer(
  rest.get('/search/repositories', (req, res, ctx) => {
    return res(
      ctx.status(OK_STATUS),
      ctx.json(fakeResponse))
  }))

beforeEach(() => {
  // eslint-disable-next-line testing-library/no-render-in-setup
  render(<GitHubSearchPage/>)
  searchButton = screen.getByRole('button', { name: /search/i })
})
// Enable API mocking before tests
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

const fireClickSearch = () => fireEvent.click(searchButton)

describe('when the developer does a search ans selects 50 row per page', () => {

  it('must fetch a new search and display 50 results on the table', async () => {
    server.use(
      rest.get('/search/repositories', handlePaginated),
    )

    fireClickSearch()

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(await screen.findAllByRole('row')).toHaveLength(31)

    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
    const listbox = screen.getByRole('listbox', { name: /rows per page/i })

    const options = within(listbox).getAllByRole('option')

    fireEvent.click(options[1])

    await waitFor(() => expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 })
    expect(await screen.findAllByRole('row')).toHaveLength(51)
  }, 10000)
})

describe('when the developer clicks on the search and then on next page button', () => {
  it('must display the next repository page', async () => {
    server.use(
      rest.get('/search/repositories', handlePaginated),
    )

    fireClickSearch()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: /next page/i }))
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

    await waitFor(() => expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 })

    expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }))

    await waitFor(() => expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled(), { timeout: 3000 })

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
  }, 10000)

})

describe('when there is an unexpected error from the backend', () => {
  it.skip('must display an alert message error 422 with the message from the service', async () => {
    expect(screen.queryByText(/validation failed/i)).not.toBeInTheDocument()

    server.use('/search/repositories', (req, res, ctx) => {
      res(
        ctx.status(UNPROCESSABLE_STATUS),
        ctx.json(makeFakeError())
      )
    })

    // click search
    fireClickSearch()
    // expect message
    expect(await screen.findByText(/validation failed/i)).toBeVisible()
  })

  it.skip('must display an alert message error 500 with the message from the service', async () => {
    expect(screen.queryByText(/unexpected error/i)).not.toBeInTheDocument()

    server.use('/search/repositories', (req, res, ctx) => {
      res(
        ctx.status(UNEXPECTED_STATUS),
        ctx.json(makeFakeError({ message: 'Unexpected error' }))
      )
    })
    fireClickSearch()
    expect(await screen.findByText(/unexpected error/i)).toBeVisible()
  })
})

describe('when the developer does a search and clicks on next page button and selects 50 rows per page', () => {
  it('must display the results of the first page', async () => {
    server.use(rest.get('/search/repositories', handlePaginated))

    fireClickSearch()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /next page/i }))

    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', { name: /search/i }),
        ).not.toBeDisabled(),
      { timeout: 3000 },
    )

    expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
    fireEvent.click(screen.getByRole('option', { name: '50' }))

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', { name: /search/i }),
        ).not.toBeDisabled(),
      { timeout: 3000 },
    )

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
  }, 30000)
})

describe('when the developer does a search and clicks on next page button and clicks on search again', () => {
  it('must display the results of the first page', async () => {
    server.use(rest.get('/search/repositories', handlePaginated))

    fireClickSearch()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: /next page/i }))

    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled()

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', { name: /search/i }),
        ).not.toBeDisabled(),
      { timeout: 3000 },
    )

    expect(screen.getByRole('cell', { name: /2-0/ })).toBeInTheDocument()

    fireClickSearch()

    await waitFor(
      () =>
        expect(
          screen.getByRole('button', { name: /search/i }),
        ).not.toBeDisabled(),
      { timeout: 3000 },
    )

    expect(screen.getByRole('cell', { name: /1-0/ })).toBeInTheDocument()
  }, 30000)
})