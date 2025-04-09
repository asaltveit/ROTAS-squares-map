import FilterSection from '../components/FilterSection'
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
      })*/
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
        const yearRangeSwitch = screen.getByLabelText('year-range-switch');
        expect(yearRangeSwitch).toBeInTheDocument();

        const place = screen.getByLabelText('Place');
        expect(place).toBeInTheDocument();
        const placeSwitch = screen.getByLabelText('place-switch');
        expect(placeSwitch).toBeInTheDocument();
        
        const type = screen.getByLabelText('Type');
        expect(type).toBeInTheDocument();
        const typeSwitch = screen.getByLabelText('location-type-switch');
        expect(typeSwitch).toBeInTheDocument();

        const script = screen.getByLabelText('Script');
        expect(script).toBeInTheDocument();
        const scriptSwitch = screen.getByLabelText('script-switch');
        expect(scriptSwitch).toBeInTheDocument();

        const text = screen.getByLabelText('Text');
        expect(text).toBeInTheDocument();
        const textSwitch = screen.getByLabelText('text-switch');
        expect(textSwitch).toBeInTheDocument();

        const firstWord = screen.getByLabelText('First word');
        expect(firstWord).toBeInTheDocument();
        const firstWordSwitch = screen.getByLabelText('first-word-switch');
        expect(firstWordSwitch).toBeInTheDocument();

        const location = screen.getByLabelText('Location');
        expect(location).toBeInTheDocument();
        const locationSwitch = screen.getByLabelText('location-switch');
        expect(locationSwitch).toBeInTheDocument();

        const yearType = screen.getByLabelText('Year type');
        expect(yearType).toBeInTheDocument();
        const yearTypeSwitch = screen.getByLabelText('year-type-switch');
        expect(yearTypeSwitch).toBeInTheDocument();

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
    })*/
})