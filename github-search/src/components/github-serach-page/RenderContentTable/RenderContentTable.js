import { Box, } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { ContentTable } from './ContentTable'

export const RenderContentTable = ({ isSearchApplied, items }) => {
  const tableTitles = ['Repository', 'Stars', 'Forks', 'Open Issues', 'Updated at']

  const renderWithBox = (children) => <Box display="flex" alignItems={'center'} justifyContent="center" height={400}>
    {children}
  </Box>

  if (isSearchApplied && !!items.length) {
    return (<ContentTable tableTitles={tableTitles} items={items} onPageChange={() => {
    }}/>)
  }
  if (isSearchApplied && !items.length) {
    return renderWithBox(
      <Typography>Your search has no results</Typography>
    )
  }
  return renderWithBox(
    <Typography>Please provide a search option and click in the search button</Typography>)

}

RenderContentTable.propTypes = {
  isSearchApplied: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.objectOf)
}