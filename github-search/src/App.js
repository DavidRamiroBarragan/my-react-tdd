import ErrorBoundary from './components/error-boundary/error-boundary'
import GitHubSearchPage from './components/github-serach-page'

function App () {
  return (
    <ErrorBoundary>
      <GitHubSearchPage/>
    </ErrorBoundary>
  )
}

export default App