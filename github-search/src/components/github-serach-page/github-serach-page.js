import { Box, Container, Grid, Paper, TablePagination } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getRepos } from '../../services'
import RenderContentTable from './RenderContentTable'
import GitHubTable from './RenderContentTable/GitHubTable'

const INITIAL_ROWS_DEFAULT = 30
export const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])
  const [searchBy, setSearchBy] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(INITIAL_ROWS_DEFAULT)
  const didMount = useRef(false)

  const handleSearch = useCallback(async () => {
    setIsSearching(() => true)
    const response = await getRepos({ q: searchBy, rowsPerPage })
    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(false)
  },[rowsPerPage, searchBy])

  const handleChange = ({ target: { value } }) => setSearchBy(value)
  const handleRowChangePerPage = (event) => {
    setRowsPerPage(+event.target.value)
  }

  useEffect(()=> {
    if(!didMount.current){
      didMount.current = true
      return
    }
    handleSearch()
  },[rowsPerPage, handleSearch])

  return (<Container>
    <Box my={2}>
      <Typography variant="h3" component="h1">Github repositories list</Typography>
    </Box>
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item md={6} xs={12}>
        <TextField fullWidth label="Filter by" id="filterBy" value={searchBy} onChange={handleChange}/>
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
              count={100}
              rowsPerPage={rowsPerPage}
              page={0}
              onPageChange={()=>{}}
              onRowsPerPageChange={handleRowChangePerPage}
            />
        </Paper>
      </RenderContentTable>
    </Box>
  </Container>)
}

export default GitHubSearchPage