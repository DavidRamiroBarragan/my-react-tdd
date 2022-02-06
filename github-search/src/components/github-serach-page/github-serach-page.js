import { Box, Container, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { useState } from 'react'
import RenderContentTable from './RenderContentTable'

export const GitHubSearchPage = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [reposList, setReposList] = useState([])

  const handleSearch = async () => {
    setIsSearching(() => true)
    const response = await fetch('/search/repositories?q=react+language:phython&page=2&per_page=50')
    const data = await response.json()
    setReposList(data.items)
    setIsSearchApplied(true)
    setIsSearching(() => false)
  }

  return (<Container>
    <Box my={2}>
      <Typography variant="h3" component="h1">Github repositories list</Typography>
    </Box>
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item md={6} xs={12}>
        <TextField fullWidth label="Filter by" id="filterBy"/>
      </Grid>
      <Grid item md={3} xs={12}>
        <Button fullWidth variant="contained" color="primary" onClick={handleSearch}
                disabled={isSearching}>Search</Button>
      </Grid>
    </Grid>
    <Box my={4}>
      <RenderContentTable isSearchApplied={isSearchApplied} items={reposList}/>
    </Box>
  </Container>)
}

export default GitHubSearchPage