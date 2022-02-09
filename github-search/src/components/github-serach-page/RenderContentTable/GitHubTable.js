import {
  Avatar,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core'
import PropTypes from 'prop-types'

const tableTitles = ['Repository', 'Stars', 'Forks', 'Open Issues', 'Updated at']

const useStyles = makeStyles({
  container:{
    maxHeight: 400
  }
})

export const GitHubTable = ({items}) => {
  const classes = useStyles()
  return(
    <TableContainer className={classes.container}>
      <Table stickyHeader>
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