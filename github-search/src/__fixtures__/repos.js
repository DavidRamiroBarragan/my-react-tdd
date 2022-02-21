import repos30Pagination from '../__fixtures__/repos-30-paginated.json'
import repos50paginated from '../__fixtures__/repos-50-paginated.json'

export const makeFakeResponse = ({ totalCount = 0 } = {}) => ({
  total_count: totalCount,
  items: []
})

export const makeFakeError = ({ message = 'Validation Failed' }) => ({
  errors: [{ resource: 'Search', field: 'q', code: 'missing' }],
  message
})

export const makeFakeRepo = ({
  id = '56757919',
  name = 'dejango-rest-framework-reactive'
} = {}) => ({
  id,
  name,
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/773036?v=4',
  },
  html_url: 'https://github.com/kriasoft/react-starter-kit',
  updated_at: '2022-02-06',
  stargazers_count: 21100,
  forks_count: 4106,
  open_issues_count: 7,
})

const reposData = ['go', 'freeCodeCamp', 'laravel', 'python', 'javascript',]

const reposList = reposData.map(name => makeFakeRepo({ name, id: name }))

export const getReposListBy = ({ name }) => reposList.filter(repo => repo.name === name)
export const getReposPerPage = ({
  currentPage,
  perPage
}) => perPage === 30 ? repos30Pagination[currentPage] : repos50paginated[currentPage]

export default ({
  makeFakeResponse,
  makeFakeRepo,
  getReposListBy,
  getReposPerPage
})