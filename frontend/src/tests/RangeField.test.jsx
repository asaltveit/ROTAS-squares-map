import RangeField from '../components/RangeField'
import React from 'react';
import { expect, describe, it, } from 'vitest';
import { render, screen } from '@testing-library/react'


describe('RangeField', () => {
    it('renders correctly', () => {
        render(<RangeField onValueChangeStart={() => {}} onValueChangeEnd={() => {}} />);
        const startInput = screen.getByLabelText('Start');
        expect(startInput).toBeInTheDocument();
        const endInput = screen.getByLabelText('End');
        expect(endInput).toBeInTheDocument();
        const dash = screen.getByText('-');
        expect(dash).toBeInTheDocument();
    })
})