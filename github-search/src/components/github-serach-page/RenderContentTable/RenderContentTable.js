import {
    Avatar,
    Box,
    Link,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

export const RenderContentTable = ({isSearchApplied}) => {
    const tableTitles = ["Repository", "Stars", "Forks", "Open Issues", "Updated at"]
    return (
        isSearchApplied ? (<Paper sx={{width: '100%', overflow: 'hidden'}}><TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                tableTitles.map((title) => <TableCell key={title}>
                                    {title}
                                </TableCell>)
                            }

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
                    rowsPerPageOptions={[30, 50, 100]}
                    component="div"
                    count={100}
                    rowsPerPage={30}
                    page={0}
                    onPageChange={() => {
                    }}
                    onRowsPerPageChange={() => {
                    }}
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