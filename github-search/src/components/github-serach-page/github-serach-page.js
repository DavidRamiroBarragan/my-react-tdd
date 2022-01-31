import { Box, Container, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { useState } from 'react'

export const GitHubSearchPage = () => {
  const [isSearching, setIsSearching]         = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)

  const handleSearch = async () => {
    setIsSearching(() => true)
    await Promise.resolve()
    setIsSearchApplied(true)
    setIsSearching(() => false)
  }

  const renderContentTable = () => {
    return <table>
      <thead>
      <tr>
        <th>
          Repository
        </th>
        <th>stars</th>
        <th>forks</th>
        <th>open issues</th>
        <th>updated at</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><img src="" alt="test"/>
          <a href="http://localhost:3000">Test</a></td>
        <td>10</td>
        <td>5</td>
        <td>2</td>
        <td>20-01-01</td>
      </tr>
      </tbody>
    </table>
  }

  return <Container>
    <Typography variant="h3" component="h1">Github repositories list</Typography>
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item md={6} xs={12}>
        <TextField fullWidth label="Filter by" id="filterBy"/>
      </Grid>
      <Grid item md={3} xs={12}>
        <Button fullWidth variant="contained" color="primary" onClick={handleSearch}
                disabled={isSearching}>Search</Button>
      </Grid>
    </Grid>
    {isSearchApplied && renderContentTable()}
    {!isSearchApplied &&
      <Box display="flex" alignItems={'center'} justifyContent="center" height={400}>
        <Typography>Please provide a search option and click in the search button</Typography>
      </Box>}
  </Container>
}

export default GitHubSearchPage