import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import PropTypes from 'prop-types'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  handleReloadClick= ()=> window.location.reload()


  render () {
    const { children } = this.props

    const { hasError } = this.state

    if(hasError){
      return <React.Fragment>
        <Typography variant="h4">There is an unexpected error</Typography>
        <Button type="button" onClick={this.handleReloadClick} variant="contained" color="primary">Reload</Button>
      </React.Fragment>
    }

    return children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary