import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {GitHubSearchPage} from './github-serach-page';

let searchButton;
beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<GitHubSearchPage/>);
    searchButton = screen.getByRole('button', {name: /search/i});
});
describe('whn the GithubSearchPage is mounted', function() {
    it('should display the title', function() {
        expect(screen.getByRole('heading', {name: /github repositories list/i})).toBeInTheDocument();
    });

    it('should contain an input text with label "filter by" field in order to do the search', () => {

        expect(screen.getByLabelText(/filter by/i)).toBeInTheDocument();
    });

    it('should contain a search button', () => {
        expect(screen.getByRole('button', {name: /search/i})).toBeInTheDocument();
    });

    it('should be a initial message \'Please provide a search option and click in the search button\'', () => {
        expect(screen.getByText(/please provide a search option and click in the search button/i)).toBeInTheDocument();
    });
});

describe('when the developers does a search', () => {
    const fireClickSearch = () => fireEvent.click(searchButton);
    it('the search button should be disabled until the search is done', async () => {
        expect(searchButton).not.toBeDisabled();

        fireClickSearch();

        expect(searchButton).toBeDisabled();

        await waitFor(() => {
            expect(searchButton).not.toBeDisabled();
        });

    });
    it('The data should be displayed as a sticky table', async () => {
        fireClickSearch();
        await waitFor(() => {
            expect(screen.queryByText(/please provide a search option and click in the search button/i))
                .not
                .toBeInTheDocument();
        });

        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('The header table should contain: Repository, stars, forks, open issues and updated at', async () => {
        fireClickSearch();

        const table                                             = await screen.findByRole('table');
        const tableHeaders                                      = within(table).getAllByRole('columnheader');
        const [repository, stars, forks, openIssues, updatedAt] = tableHeaders;

        expect(tableHeaders).toHaveLength(5);
        expect(repository).toHaveTextContent(/repository/i);
        expect(stars).toHaveTextContent(/stars/i);
        expect(forks).toHaveTextContent(/forks/i);
        expect(openIssues).toHaveTextContent(/open issues/i);
        expect(updatedAt).toHaveTextContent(/updated at/i);
    });
});