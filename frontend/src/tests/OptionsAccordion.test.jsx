import OptionsAccordion from '../components/OptionsAccordion'
import React from 'react';
//import react from '@vitejs/plugin-react'
import { expect, describe, it, } from 'vitest';
import { render, screen } from '@testing-library/react'


describe('OptionsAccordion', () => {
    it('renders correctly', () => {
        const options = [
            {
                header: "test1",
                body: <div>test2</div>
            }
        ]
        render(<OptionsAccordion children={options} />);
        const headingElement = screen.getByLabelText('test1');
        expect(headingElement).toBeInTheDocument();
        const bodyElement = screen.getByLabelText('test2');
        expect(bodyElement).toBeInTheDocument();
    })
})
