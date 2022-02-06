export const makeFakeResponse = (totalCount = 0) => ({
  total_count: totalCount,
  items: []
})

export const makeFakeRepo = () => ({
  id: '56757919',
  name: 'dejango-rest-framewort-reactive',
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/773036?v=4',
  },
  html_url: 'https://github.com/kriasoft/react-starter-kit',
  updated_at: '2022-02-06',
  stargazers_count: 21100,
  forks_count: 4106,
  open_issues_count: 7,
})

export default ({
  makeFakeResponse,
  makeFakeRepo
})