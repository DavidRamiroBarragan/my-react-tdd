const baseUrl = process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_BASE_URL
const getRepos = ({
  q,
  rowsPerPage,
  currentPage
}) => fetch(`${baseUrl}/search/repositories?q=${q}&page=${currentPage}&per_page=${rowsPerPage}`)

export { getRepos }