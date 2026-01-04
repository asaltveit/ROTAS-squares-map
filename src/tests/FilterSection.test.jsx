/*import FilterSection from '../components/FilterSection'
import React from 'react';
import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react'
//import axios from 'axios'
// TODO mock supabase

describe('FilterSection', () => {
    /*beforeEach(async () => {
        vi.mock('axios');
        const mockData = { data: ["latin", "not latin"] };
        axios.get.mockResolvedValue(mockData);
      })
    it('renders correctly', () => {
        render(<FilterSection />);

        // Labels
        const locationFiltersLabel = screen.getByText('Location Filters');
        expect(locationFiltersLabel).toBeInTheDocument();

        const timelineFiltersLabel = screen.getByText('Timeline Filters');
        expect(timelineFiltersLabel).toBeInTheDocument();

        // Filters
        const yearRange = screen.getByLabelText('Year range');
        expect(yearRange).toBeInTheDocument();

        const place = screen.getByLabelText('Place');
        expect(place).toBeInTheDocument();
        
        const type = screen.getByLabelText('Type');
        expect(type).toBeInTheDocument();

        const script = screen.getByLabelText('Script');
        expect(script).toBeInTheDocument();

        const text = screen.getByLabelText('Text');
        expect(text).toBeInTheDocument();

        const firstWord = screen.getByLabelText('First word');
        expect(firstWord).toBeInTheDocument();

        const location = screen.getByLabelText('Location');
        expect(location).toBeInTheDocument();

        const yearType = screen.getByLabelText('Year type');
        expect(yearType).toBeInTheDocument();

        const clearAllButton = screen.getByText('Clear All');
        expect(clearAllButton).toBeInTheDocument();
    })  
    /*describe('Filters', () => {
        it('LocationType', async () => {
            render(<FilterSection />);
            const locationTypeSwitch = screen.getByLabelText('location-type-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(locationTypeSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('Script', async () => {
            render(<FilterSection />);
            const scriptSwitch = screen.getByLabelText('script-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(scriptSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('FirstWord', async () => {
            render(<FilterSection />);
            const firstWordSwitch = screen.getByLabelText('first-word-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(firstWordSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('Place', async () => {
            render(<FilterSection />);
            const placeSwitch = screen.getByLabelText('place-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(placeSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('Location', async () => {
            render(<FilterSection />);
            const locationSwitch = screen.getByLabelText('location-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(locationSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('YearType', async () => {
            render(<FilterSection />);
            const yearTypeSwitch = screen.getByLabelText('year-type-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(yearTypeSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('Text', async () => {
            render(<FilterSection />);
            const textSwitch = screen.getByLabelText('text-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(textSwitch)
            });
            const select = screen.getByLabelText('dropdown-select');
            expect(select).toBeInTheDocument();
        })
        it('Year range', async () => {
            render(<FilterSection />);
            const yearRangeSwitch = screen.getByLabelText('year-range-switch');
            act(() => {
                /* fire events that update state 
                fireEvent.click(yearRangeSwitch)
            });
            const rangeFieldStart = screen.getByLabelText('Start');
            expect(rangeFieldStart).toBeInTheDocument();
            const rangeFieldEnd = screen.getByLabelText('End');
            expect(rangeFieldEnd).toBeInTheDocument();
        })
    })
})*/

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, within } from 'vitest';
import userEvent from '@testing-library/user-event';
import FilterSection from '@/components/FilterSection';
import { useMapStore } from '@/stores/MapStore';
import { useFilterStore } from '@/stores/FilterStore';
import { supabase } from '@/supabaseClient';
import '@testing-library/jest-dom';

vi.mock('@/stores/MapStore', () => ({
    useMapStore: vi.fn(),
}));

vi.mock('@/stores/FilterStore', () => ({
    useFilterStore: vi.fn(),
}));

vi.mock('@/supabaseClient', () => ({
    supabase: {
        rpc: vi.fn(),
    },
}));

const createRpcMock = (data = []) => ({
    data,
    error: null,
});

describe('FilterSection', () => {
    const mockSetters = {
        setPlaces: vi.fn(),
        setFirstWords: vi.fn(),
        setScripts: vi.fn(),
        setTexts: vi.fn(),
        setLocs: vi.fn(),

        setTypeFilter: vi.fn(),
        setScriptFilter: vi.fn(),
        setTextFilter: vi.fn(),
        setFirstWordFilter: vi.fn(),
        setPlaceFilter: vi.fn(),
        setLocationFilter: vi.fn(),
        setYearType: vi.fn(),
        clearFilters: vi.fn(),
    };

    beforeEach(() => {
        useMapStore.mockReturnValue({
            locationTypes: ['city', 'village'],
        });

        useFilterStore.mockReturnValue({
            ...mockSetters,

            type: '',
            script: '',
            text: '',
            firstWord: '',
            place: '',
            location: '',
            yearType: '',

            scripts: [],
            texts: [],
            locs: [],
            firstWords: [],
            places: [],
        });

        supabase.rpc.mockImplementation((name) =>
            Promise.resolve(createRpcMock(['City']))
        );
    });

    it('renders all dropdowns and fields', () => {
        render(<FilterSection />);

        expect(screen.getByLabelText(/location-type-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/script-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/text-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/first-word-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/place-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/location-dropdown/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/year-type-dropdown/i)).toBeInTheDocument();
        // Start, End field of the Year Range
        expect(screen.getByLabelText(/Start/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/End/i)).toBeInTheDocument();
    });

    it('calls RPC functions on mount and sets data', async () => {
        render(<FilterSection />);

        await waitFor(() => {
            expect(supabase.rpc).toHaveBeenCalledWith('get_distinct_script');
            expect(mockSetters.setScripts).toHaveBeenCalled();

            expect(supabase.rpc).toHaveBeenCalledWith('get_distinct_location');
            expect(mockSetters.setLocs).toHaveBeenCalled();

            expect(supabase.rpc).toHaveBeenCalledWith('get_distinct_text');
            expect(mockSetters.setTexts).toHaveBeenCalled();

            expect(supabase.rpc).toHaveBeenCalledWith('get_distinct_place');
            expect(mockSetters.setPlaces).toHaveBeenCalled();

            expect(supabase.rpc).toHaveBeenCalledWith('get_distinct_first_word');
            expect(mockSetters.setFirstWords).toHaveBeenCalled();
        });
    });

    it('triggers filter setter when dropdown value changes', async () => {
        render(<FilterSection />);
        // TODO: dropdown is not expanded
        const dropdown = screen.getByLabelText(/location-type-dropdown/i);
        expect(dropdown).toBeInTheDocument();

        // Click on the MUI "select" (as found by the label).
        const selectLabel = "location-type-dropdown";
        const selectEl = await screen.findByLabelText(selectLabel);

        expect(selectEl).toBeInTheDocument();

        act(() => {
            userEvent.click(selectEl);
            //fireEvent.mouseDown(getByRole('combobox'));
        });

        // Locate the corresponding popup (`listbox`) of options.
        const optionsPopupEl = await screen.findByRole("combobox", { // list
            name: selectLabel
        });

        // Click an option in the popup.
        userEvent.click(within(optionsPopupEl).getByText(/marshmallow/i));

        // Confirm the outcome.
        expect(
            await screen.findByText(/the thing is: marshmallow/i)
        ).toBeInTheDocument();
       /* const {getByRole} = render(<FilterSection />);
        
        // Open the dropdown
        const dropdown = screen.getByLabelText(/location-type-dropdown/i);
        expect(dropdown).toBeInTheDocument();
        act(() => {
            fireEvent.mouseDown(getByRole('button'), {name: /location-type-dropdown/i})
            //fireEvent.mouseDown(dropdown); // <- Opens the MUI dropdown
            //fireEvent.mouseDown(getByRole('combobox', {name: /location-type-dropdown/i}))
        });
        screen.debug()
        const listbox = within(getByRole('combobox'));
        act(() => {
            
            fireEvent.click(listbox.getByText(/menu item City/i));
        });
        screen.debug()
        // Match option by partial content (handles whitespace or nested elements)
        await waitFor(async () => {
            const option = await screen.findByLabelText(/menu item City/i);
            /*const option = await screen.findByText((content, element) =>
                content.includes('menu item City')
            );
        });

        fireEvent.click(option); // Select it

        expect(mockSetters.setTypeFilter).toHaveBeenCalledWith('city');*/
    });

    it('calls clearFilters on "Clear All" button click', () => {
        render(<FilterSection />);

        const clearButton = screen.getByRole('button', { name: /clear all/i });
        act(() => {
            fireEvent.click(clearButton);
        });

        expect(mockSetters.clearFilters).toHaveBeenCalled();
    });
});
