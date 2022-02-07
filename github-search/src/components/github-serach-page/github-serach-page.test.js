import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { getReposListBy, getReposPerPage, makeFakeRepo, makeFakeResponse } from '../../__fixtures__/repos'

import { OK_STATUS } from '../../consts'

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

describe('whn the GithubSearchPage is mounted', function () {
  it('should display the title', function () {
    expect(screen.getByRole('heading', { name: /github repositories list/i })).toBeInTheDocument()
  })

  it('should contain an input text with label "filter by" field in order to do the search', () => {

    expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument()
  })

  it('should contain a search button', () => {
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('should be a initial message \'Please provide a search option and click in the search button\'', () => {
    expect(screen.getByText(/please provide a search option and click in the search button/i)).toBeInTheDocument()
  })
})

describe('when the developers does a search', () => {
  it('the search button should be disabled until the search is done', async () => {
    expect(searchButton).not.toBeDisabled()

    fireClickSearch()

    expect(searchButton).toBeDisabled()

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled()
    })

  })
  it('The data should be displayed as a sticky table', async () => {
    fireClickSearch()
    await waitFor(() => {
      expect(screen.queryByText(/please provide a search option and click in the search button/i))
        .not
        .toBeInTheDocument()
    })

    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('The header table should contain: Repository, stars, forks, open issues and updated at', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')
    const withTable = within(table)
    const tableHeaders = withTable.getAllByRole('columnheader')

    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders

    expect(tableHeaders).toHaveLength(5)
    expect(repository).toHaveTextContent(/repository/i)
    expect(stars).toHaveTextContent(/stars/i)
    expect(forks).toHaveTextContent(/forks/i)
    expect(openIssues).toHaveTextContent(/open issues/i)
    expect(updatedAt).toHaveTextContent(/updated at/i)
  })

  it('each table result must contain: owner avatar image, stars, updated at, forks, open issues', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')
    const withTable = within(table)
    const tableCells = withTable.getAllByRole('cell')
    const [repository, stars, forks, openIssues, updatedAt] = tableCells

    const avatarImg = within(repository).getByRole('img', { name: fakeRepo.name })
    expect(avatarImg).toBeInTheDocument()

    expect(repository).toHaveTextContent(fakeRepo.name)
    expect(stars).toHaveTextContent(fakeRepo.stargazers_count)
    expect(forks).toHaveTextContent(fakeRepo.forks_count)
    expect(openIssues).toHaveTextContent(fakeRepo.open_issues_count)
    expect(updatedAt).toHaveTextContent(fakeRepo.updated_at)
    expect(within(repository).getByText(fakeRepo.name).closest('a')).toHaveAttribute('href', fakeRepo.html_url)
    expect(avatarImg).toHaveAttribute('src', fakeRepo.owner.avatar_url)

  })

  it('must display the total results number of the search and the current number of results', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    expect(screen.getByText(/1-30 of 100/i)).toBeInTheDocument()
  })

  it('results size per page select/combobox with the options: 30,50,100. The default is 30', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))

    const listbox = screen.getByRole('listbox', { name: /rows per page/i })

    const options = within(listbox).getAllByRole('option')

    const [items_30, items_50, items_100] = options
    expect(items_30).toHaveTextContent(/30/)
    expect(items_50).toHaveTextContent(/50/)
    expect(items_100).toHaveTextContent(/100/)
  })
  it('must display a nex button and a previous button', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled()
  })
})

describe('when the developer does a search without results', () => {
  it('must show a empty state message "Your search has no results"', async () => {
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(ctx.status(OK_STATUS), ctx.json(makeFakeResponse())),
      ),
    )

    fireClickSearch()

    await waitFor(() =>
      expect(
        screen.getByText(/your search has no results/i),
      ).toBeInTheDocument(),
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

describe('when the developer types on filter by and does a search', () => {
  it('must display the related repos', async () => {
    const internalFakeResponse = makeFakeResponse()
    const REPO_NAME = 'laravel'

    const expectedRepo = getReposListBy({ name: REPO_NAME })[0]

    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(OK_STATUS),
          ctx.json({
            ...internalFakeResponse,
            items: getReposListBy({ name: req.url.searchParams.get('q') }),
          }),
        ),
      ),
    )

    fireEvent.change(screen.getByLabelText(/filter by/i), {
      target: { value: REPO_NAME },
    })

    fireClickSearch()

    const table = await screen.findByRole('table')

    expect(table).toBeInTheDocument()

    const withinTable = within(table)

    const tableCells = withinTable.getAllByRole('cell')

    const [repository] = tableCells

    expect(repository).toHaveTextContent(expectedRepo.name)
  })
})

describe('when the developer does a search ans selects 50 row per page', () => {
  test('must fetch a new search and display 50 resuls on the table', async () => {
    server.use(
      rest.get('/search/repositories', (req, res, ctx) =>
        res(
          ctx.status(OK_STATUS),
          ctx.json({
            ...makeFakeResponse(),
            items: getReposPerPage({
              perPage: Number(req.url.searchParams.get('per_page')),
              currentPage: Number(req.url.searchParams.get('page'))
            }),
          }),
        ),
      ),
    )

    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(await screen.findAllByRole('row')).toHaveLength(31)

    fireEvent.mouseDown(screen.getByLabelText(/rows per page/i))
    fireEvent.click(screen.getByRole('option'),{name: '50'})
    expect(await screen.findAllByRole('row')).toHaveLength(51)

  })
})