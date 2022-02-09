import { Avatar, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import PropTypes from 'prop-types'

const tableTitles = ['Repository', 'Stars', 'Forks', 'Open Issues', 'Updated at']

export const GitHubTable = ({items}) => {
  return(
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {tableTitles.map(title =><TableCell key={title}>{title}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            items.map(item => <TableRow key={item.id}>
              <TableCell><Avatar src={item.owner.avatar_url} alt={item.name}/>
                <Link href={item.html_url}>{item.name}</Link></TableCell>
              <TableCell>{item.stargazers_count}</TableCell>
              <TableCell>{item.forks_count}</TableCell>
              <TableCell>{item.open_issues_count}</TableCell>
              <TableCell>{item.updated_at}</TableCell>
            </TableRow>)
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default GitHubTable;

GitHubTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
}