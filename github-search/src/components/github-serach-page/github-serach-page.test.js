import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { GitHubSearchPage } from './github-serach-page'

let searchButton
const fakeRepo = {
  id: '56757919',
  name: 'dejango-rest-framewort-reactive',
  owner: {
    'avatar_url': 'https://avatars.githubusercontent.com/u/773036?v=4',
  },
  'html_url': 'https://github.com/kriasoft/react-starter-kit',
  'updated_at': '2022-02-06T10:21:59Z',
  'stargazers_count': 21100,
  'forks_count': 4106,
  'open_issues_count': 7,
}
const server = setupServer(rest.post('/seach/repositories', (requ, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      'total_count': 8643,
      'incomplete_results': false,
      items: [fakeRepo]
    }))
}))

beforeEach(() => {
  // eslint-disable-next-line testing-library/no-render-in-setup
  render(<GitHubSearchPage/>)
  searchButton = screen.getByRole('button', { name: /search/i })
})
// Enable API mocking before tests
beforeAll(() => {
  server.listen()
})

// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  server.resetHandlers()
})

// Disable API mocking after the tests are done.
afterAll(() => server.close())

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
  const fireClickSearch = () => fireEvent.click(searchButton)
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

    expect(withTable.getByRole('img', { name: /test/i })).toBeInTheDocument()
    const [repository, stars, forks, openIssues, updatedAt] = tableHeaders

    expect(tableHeaders).toHaveLength(5)
    expect(repository).toHaveTextContent(/repository/i)
    expect(stars).toHaveTextContent(/stars/i)
    expect(forks).toHaveTextContent(/forks/i)
    expect(openIssues).toHaveTextContent(/open issues/i)
    expect(updatedAt).toHaveTextContent(/updated at/i)
    expect(withTable.getByText(/test/i).closest('a')).toHaveAttribute('href', 'http://localhost:3000')
  })

  it('each table result must contain: owner avatar image, stars, updated at, forks, open issues', async () => {
    fireClickSearch()

    const table = await screen.findByRole('table')
    const withTable = within(table)
    const tableCells = withTable.getAllByRole('cell')
    const [repository, stars, forks, openIssues, updatedAt] = tableCells

    expect(repository).toHaveTextContent(/test/i)
    expect(stars).toHaveTextContent(/10/i)
    expect(forks).toHaveTextContent(/5/i)
    expect(openIssues).toHaveTextContent(/2/i)
    expect(updatedAt).toHaveTextContent(/20-01-01/i)
    expect(within(repository).getByText(/test/i).closest('a')).toHaveAttribute('href', 'http://localhost:3000')

  })

  it('must display the total results number of the search and the current number of results', async () => {
    fireClickSearch()
    await screen.findByRole('table')
    expect(screen.getByText(/1-10 of 100/i)).toBeInTheDocument()
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

describe('when the developer does a searc whithout results', () => {
  it.todo('must show a empty state message', () => {

  })
})
