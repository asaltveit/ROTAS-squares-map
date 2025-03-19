import RadioButtonRow from '../components/RadioButtonRow'
import React from 'react';
import { expect, describe, it, } from 'vitest';
import { render, screen } from '@testing-library/react'


describe('RadioButtonRow', () => {
    it('renders correctly', () => {
        render(<RadioButtonRow onValueChange={() => {}} />);
        const label = screen.getByLabelText('Form type:');
        expect(label).toBeInTheDocument();
        const addInput = screen.getByLabelText('Add');
        expect(addInput).toBeInTheDocument();
        const updateInput = screen.getByLabelText('Update');
        expect(updateInput).toBeInTheDocument();
        const deleteInput = screen.getByText('Delete');
        expect(deleteInput).toBeInTheDocument();
    })
})