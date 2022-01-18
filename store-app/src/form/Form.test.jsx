import userEvent from '@testing-library/user-event';
import React from 'react';
import {render, screen} from '@testing-library/react';
import {Form} from './Form';

describe('when the component is mounted', () => {
    beforeEach(() => {render(<Form/>)})
    it('should be a create product form page.', function() {
        expect(screen.getByRole('heading', {name: /create product/i})).toBeInTheDocument();
    });
    it('should exist the fields: name, size, type (electronic, furniture, clothing)',
       function() {
            expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
            expect(screen.queryByText(/electronic/i)).toBeInTheDocument()
       });
    it('should exists the submit button', () => {
        expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument()
    });

});

describe('when the use submits the form without values', () => {
    it('should display validation messages', () => {
        render(<Form/>)
        expect(screen.queryByText(/The name is required/i)).not.toBeInTheDocument()

        userEvent.click(screen.getByRole('button', {name: /submit/i}))

        expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
    })
})