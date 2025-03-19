import OptionsAccordion from '../components/OptionsAccordion'
import React from 'react';
import { expect, describe, it, } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react'


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
    })

    it('opens', () => {
        const options = [
            {
                header: "test1",
                body: <div>test2</div>
            }
        ]
        render(<OptionsAccordion children={options} />);

        const headingElement = screen.getByLabelText('test1');
        expect(headingElement).toBeInTheDocument();

        fireEvent.click(headingElement)

        const bodyElement = screen.getByText('test2');
        expect(bodyElement).toBeInTheDocument();
    })
    it('has multiple accordions', () => {
        const options = [
            {
                header: "test1",
                body: <div>test2</div>
            },
            {
                header: "test3",
                body: <div>test4</div>
            },
            {
                header: "test5",
                body: <div>test6</div>
            }
        ]
        render(<OptionsAccordion children={options} />);

        const heading1Element = screen.getByLabelText('test1');
        expect(heading1Element).toBeInTheDocument();

        fireEvent.click(heading1Element)

        const body1Element = screen.getByText('test2');
        expect(body1Element).toBeInTheDocument();

        const heading2Element = screen.getByLabelText('test3');
        expect(heading2Element).toBeInTheDocument();

        fireEvent.click(heading2Element)

        const body2Element = screen.getByText('test4');
        expect(body2Element).toBeInTheDocument();

        const heading3Element = screen.getByLabelText('test5');
        expect(heading3Element).toBeInTheDocument();

        fireEvent.click(heading3Element)

        const body3Element = screen.getByText('test6');
        expect(body3Element).toBeInTheDocument();
    })
    it('handles having no children', () => {
        render(<OptionsAccordion />)
        // What to do here?
    })
})
