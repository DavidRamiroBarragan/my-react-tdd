import {
  Avatar,
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

export const RenderContentTable = ({ isSearchApplied }) => {
  return (
    isSearchApplied ? (<Paper sx={{ width: '100%', overflow: 'hidden' }}><TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Repository
              </TableCell>
              <TableCell>Stars</TableCell>
              <TableCell>Forks</TableCell>
              <TableCell>Open issues</TableCell>
              <TableCell>Updated at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell><Avatar src="/logo192.png" alt="test"/>
                <Link href="http://localhost:3000">Test</Link></TableCell>
              <TableCell>10</TableCell>
              <TableCell>5</TableCell>
              <TableCell>2</TableCell>
              <TableCell>20-01-01</TableCell>
            </TableRow>
          </TableBody>
        </Table></TableContainer>
          <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={100}
              rowsPerPage={10}
              page={0}
              onPageChange={()=>{}}
              onRowsPerPageChange={()=>{}}
          /></Paper>)
      :
      (<Box display="flex" alignItems={'center'} justifyContent="center" height={400}>
        <Typography>Please provide a search option and click in the search button</Typography>
      </Box>)
  )
}

RenderContentTable.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
}