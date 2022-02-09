import { Box, } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

export const RenderContentTable = ({ isSearchApplied, children, reposList }) => {

  const renderWithBox = (children) => <Box display="flex" alignItems={'center'} justifyContent="center" height={400}>
    {children}
  </Box>

  if (isSearchApplied && !!reposList.length) {
    return children
  }
  if (isSearchApplied && !reposList.length) {
    return renderWithBox(
      <Typography>Your search has no results</Typography>
    )
  }
  return renderWithBox(
    <Typography>Please provide a search option and click in the search button</Typography>)

}

RenderContentTable.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  reposList: PropTypes.arrayOf(PropTypes.object)
}