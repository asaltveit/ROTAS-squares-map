import DropDown from '../components/DropDown'
import React from 'react';
import { expect, describe, it, } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react'

const options = [
    { title: 'Option 1', value: '1' },
    { title: 'Option 2', value: '2' },

]

describe('DropDown', () => {
    it('renders the label correctly', () => {
        render(
          <DropDown
            label="Test Label"
            value=""
            onValueChange={() => {}}
            items={options}
          />
        );
        expect(screen.getByLabelText('dropdown-select-label')).toHaveTextContent('Test Label');
      });
    it('renders all items including empty item when "empty" is true', () => {
        const {getByRole} = render(<DropDown onValueChange={() => {}} items={options} label="test" empty={true} value="" />);
        act(() => {
            /* fire events that update state */
            fireEvent.mouseDown(getByRole('combobox'));
        });

        expect(screen.getByLabelText('menu item blank')).toBeInTheDocument();
        expect(screen.getByLabelText('menu item Option 1')).toBeInTheDocument();
        expect(screen.getByLabelText('menu item Option 2')).toBeInTheDocument();
    })
    it('does not render empty item when "empty" is false', () => {
        const {getByRole} = render(<DropDown onValueChange={() => {}} items={options} label="test" value="" />);
        act(() => {
            /* fire events that update state */
            fireEvent.mouseDown(getByRole('combobox'))
        });
        expect(screen.queryByLabelText('menu item blank')).not.toBeInTheDocument();
    })

    it('selects the correct value', () => {
        render(
          <DropDown
            label="Value Test"
            value="2"
            onValueChange={() => {}}
            items={options}
          />
        );
    
        const select = screen.getByRole('combobox');
        expect(select).toHaveTextContent('Option 2');
      });
})