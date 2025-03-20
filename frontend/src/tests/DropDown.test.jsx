import DropDown from '../components/DropDown'
import React from 'react';
import { expect, describe, it, } from 'vitest';
import { render, screen, act, fireEvent, within } from '@testing-library/react'

const options = [
    {
        title: "1",
        value: 1,
    },
    {
        title: "2",
        value: 2,
    },

]

describe('DropDown', () => {
    it('renders correctly with other option', () => {
        const {getByRole} = render(<DropDown onValueChange={() => {}} items={options} label="test" other={true} />);
        const label = screen.getByLabelText('dropdown-select-label');
        expect(label).toBeInTheDocument();
        const select = screen.getByLabelText('dropdown-select');
        expect(select).toBeInTheDocument();
        act(() => {
            /* fire events that update state */
            fireEvent.mouseDown(getByRole('combobox'))
        });
        const firstItem = screen.getByLabelText('menu item 1')
        expect(firstItem).toBeInTheDocument();
        const secondItem = screen.getByLabelText('menu item 2');
        expect(secondItem).toBeInTheDocument();
        const otherItem = screen.getByLabelText('menu item other');
        expect(otherItem).toBeInTheDocument();
    })
    it('renders correctly without other option', () => {
        const {getByRole} = render(<DropDown onValueChange={() => {}} items={options} label="test" />);
        const label = screen.getByLabelText('dropdown-select-label');
        expect(label).toBeInTheDocument();
        const select = screen.getByLabelText('dropdown-select');
        expect(select).toBeInTheDocument();
        act(() => {
            /* fire events that update state */
            fireEvent.mouseDown(getByRole('combobox'))
        });
        const firstItem = screen.getByLabelText('menu item 1')
        expect(firstItem).toBeInTheDocument();
        const secondItem = screen.getByLabelText('menu item 2');
        expect(secondItem).toBeInTheDocument();
        const otherItem = screen.queryByLabelText('menu item other');
        expect(otherItem).not.toBeInTheDocument();
    })
})