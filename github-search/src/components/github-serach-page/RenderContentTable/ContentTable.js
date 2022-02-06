import {
  Avatar, Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core'
import PropTypes from 'prop-types'

export function ContentTable (props) {
  return <Paper sx={{ width: '100%', overflow: 'hidden' }}><TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          {props.tableTitles.map((title) =>
            <TableCell key={title}>
            {title}
          </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {
          props.items.map(item => <TableRow key={item.id}>
            <TableCell><Avatar src={item.owner.avatar_url} alt={item.name}/>
              <Link href={item.html_url}>{item.name}</Link></TableCell>
            <TableCell>{item.stargazers_count}</TableCell>
            <TableCell>{item.forks_count}</TableCell>
            <TableCell>{item.open_issues_count}</TableCell>
            <TableCell>{item.updated_at}</TableCell>
          </TableRow>)
        }
        <TableRow>

        </TableRow>
      </TableBody>
    </Table></TableContainer>
    <TablePagination
      rowsPerPageOptions={[30, 50, 100]}
      component="div"
      count={100}
      rowsPerPage={30}
      page={0}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onPageChange}
    /></Paper>
}

ContentTable.propTypes = {
  strings: PropTypes.arrayOf(PropTypes.string),
  tableTitles: PropTypes.arrayOf(PropTypes.string),
  items: PropTypes.arrayOf(PropTypes.any),
}