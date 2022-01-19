import userEvent from '@testing-library/user-event';
import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {Form} from './Form';

    beforeEach(() => {render(<Form/>)})
describe('when the component is mounted', () => {
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
        expect(screen.queryByText(/The name is required/i)).not.toBeInTheDocument()

        userEvent.click(screen.getByRole('button', {name: /submit/i}))

        expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
        expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
    })
})

describe("when the user blurs an empty field", () => {
    it('should display validation message for the input name', () => {

        expect(screen.queryByText(/The name is required/i)).not.toBeInTheDocument();

        fireEvent.blur(screen.getByLabelText(/name/i), {
            target:{ name: 'name', value: ''}
        });

        expect(screen.queryByText(/The name is required/i)).toBeInTheDocument()
    })

    it('should display validation message for the input size', () => {

        expect(screen.queryByText(/The size is required/i)).not.toBeInTheDocument();

        fireEvent.blur(screen.getByLabelText(/size/i), {
            target:{ name: 'size', value: ''}
        });

        expect(screen.queryByText(/The size is required/i)).toBeInTheDocument()
    })

    it('should display validation message for the input type', () => {

        expect(screen.queryByText(/The type is required/i)).not.toBeInTheDocument()

        fireEvent.blur(screen.getByLabelText(/type/i), {
            target:{ name: 'type', value: ''}
        });

        expect(screen.queryByText(/The type is required/i)).toBeInTheDocument()
    })
})