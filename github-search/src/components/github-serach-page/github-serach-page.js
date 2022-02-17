import { Box, Container, Grid, Paper, TablePagination } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRepos } from '../../services'
import RenderContentTable from './RenderContentTable'
import GitHubTable from './RenderContentTable/GitHubTable'

const INITIAL_ROWS_DEFAULT = 30
const INITIAL_CURRENT_PAGE = 0
const INITIAL_TOTAL_COUNT = 0
export const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_DEFAULT)
  const [currentPage, setCurrentPage] = useState(INITIAL_CURRENT_PAGE)
  const [totalCount, setTotalCount] = useState(INITIAL_TOTAL_COUNT)

  const didMount = useRef(false)
  const searchByInput = useRef(null)

  const handleSearch = useCallback(async () => {
    setIsSearching(() => true)
    const response = await getRepos({ q: searchByInput.current.value, rowsPerPage, currentPage })
    const data = await response.json()
    setReposList(data.items)
    setTotalCount(data.total_count)
    setIsSearchApplied(true)
    setIsSearching(false)
  }, [rowsPerPage, currentPage])

  const handleRowChangePerPage = (event) => {
    setRowsPerPage(+event.target.value)
  }

  const handleOnChangePage = (event, newPage) => {
    setCurrentPage(newPage)
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    handleSearch()
  }, [rowsPerPage, currentPage, handleSearch])

  return (<Container>
    <Box my={2}>
      <Typography variant="h3" component="h1">Github repositories list</Typography>
    </Box>
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item md={6} xs={12}>
        <TextField fullWidth label="Filter by" id="filterBy" inputRef={searchByInput}/>
      </Grid>
      <Grid item md={3} xs={12}>
        <Button fullWidth variant="contained" color="primary" onClick={handleSearch}
                disabled={isSearching}>Search</Button>
      </Grid>
    </Grid>
    <Box my={4}>
      <RenderContentTable
        isSearchApplied={isSearchApplied}
        reposList={reposList}
      >
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <GitHubTable items={reposList}/>
          <TablePagination
            rowsPerPageOptions={[30, 50, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={handleOnChangePage}
            onRowsPerPageChange={handleRowChangePerPage}
          />
        </Paper>
      </RenderContentTable>
    </Box>
  </Container>)
}

export default GitHubSearchPage