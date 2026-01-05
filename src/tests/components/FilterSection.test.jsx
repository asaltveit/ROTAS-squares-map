import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import FilterSection from '@/components/FilterSection';
import { useMapStore } from '@/stores/MapStore';
import { useFilterStore } from '@/stores/FilterStore';
import { supabase } from '@/supabaseClient';
import '@testing-library/jest-dom';

// Mock TimelineSlider component
vi.mock('@/components/TimelineSlider', () => ({
    default: () => <div data-testid="timeline-slider">Timeline Slider</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    X: () => <svg data-testid="x-icon" />,
}));

// Mock zustand's useShallow
vi.mock('zustand/react/shallow', () => ({
    useShallow: (selector) => selector,
}));

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

vi.mock('@/utilities/UtilityFunctions', () => ({
    convertStringsToOptions: (strings) => {
        return strings.map((s) => ({
            title: s.charAt(0).toUpperCase() + s.slice(1),
            value: s,
        }));
    },
}));

vi.mock('@/constants', () => ({
    yearTypeOptions: [
        { title: 'Year created', value: 'created' },
        { title: 'Year discovered', value: 'discovered' },
    ],
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
        setTimelineStart: vi.fn(),
        setTimelineEnd: vi.fn(),
        clearFilters: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();

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
            yearType: 'created',
            timelineStart: 0,
            timelineEnd: 2100,
            timelineYear: 0,

            scripts: [],
            texts: [],
            locs: [],
            firstWords: [],
            places: [],
        });

        supabase.rpc.mockImplementation((name) =>
            Promise.resolve(createRpcMock(['City', 'Village']))
        );
    });

    it('renders the Filters heading', () => {
        render(<FilterSection />);
        expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('renders TimelineSlider component', () => {
        render(<FilterSection />);
        expect(screen.getByTestId('timeline-slider')).toBeInTheDocument();
    });

    it('renders Temporal Range section with year inputs', () => {
        render(<FilterSection />);
        
        expect(screen.getByText('Temporal Range')).toBeInTheDocument();
        expect(screen.getByLabelText('Start Year')).toBeInTheDocument();
        expect(screen.getByLabelText('End Year')).toBeInTheDocument();
    });

    it('renders Year Type select', () => {
        render(<FilterSection />);
        const yearTypeSelect = screen.getByLabelText('Year Type');
        expect(yearTypeSelect).toBeInTheDocument();
        expect(yearTypeSelect.tagName).toBe('SELECT');
    });

    it('renders all filter selects', () => {
        render(<FilterSection />);

        expect(screen.getByLabelText('Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Script')).toBeInTheDocument();
        expect(screen.getByLabelText('First Word')).toBeInTheDocument();
        /*
        Removing these filters for now
        expect(screen.getByLabelText('Text')).toBeInTheDocument();
        expect(screen.getByLabelText('Place')).toBeInTheDocument();
        expect(screen.getByLabelText('Location')).toBeInTheDocument();*/
    });

    it('renders Clear All Filters button', () => {
        render(<FilterSection />);
        const clearButton = screen.getByRole('button', { name: /clear all filters/i });
        expect(clearButton).toBeInTheDocument();
    });

    it('renders close button when onClose prop is provided', () => {
        const mockOnClose = vi.fn();
        render(<FilterSection onClose={mockOnClose} />);
        
        const closeButton = screen.getByTitle('Close filters');
        expect(closeButton).toBeInTheDocument();
    });

    it('does not render close button when onClose prop is not provided', () => {
        render(<FilterSection />);
        
        const closeButton = screen.queryByTitle('Close filters');
        expect(closeButton).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const mockOnClose = vi.fn();
        render(<FilterSection onClose={mockOnClose} />);
        
        const closeButton = screen.getByTitle('Close filters');
        fireEvent.click(closeButton);
        
        expect(mockOnClose).toHaveBeenCalledTimes(1);
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

    it('triggers setTypeFilter when Type select value changes', async () => {
        useFilterStore.mockReturnValue({
            ...mockSetters,
            type: '',
            script: '',
            text: '',
            firstWord: '',
            place: '',
            location: '',
            yearType: 'created',
            timelineStart: 0,
            timelineEnd: 2100,
            timelineYear: 0,
            scripts: [],
            texts: [],
            locs: [],
            firstWords: [],
            places: [],
        });

        render(<FilterSection />);
        
        const typeSelect = screen.getByLabelText('Type');
        await userEvent.selectOptions(typeSelect, 'city');

        expect(mockSetters.setTypeFilter).toHaveBeenCalledWith('city');
    });

    it('triggers setScriptFilter when Script select value changes', async () => {
        useFilterStore.mockReturnValue({
            ...mockSetters,
            type: '',
            script: '',
            text: '',
            firstWord: '',
            place: '',
            location: '',
            yearType: 'created',
            timelineStart: 0,
            timelineEnd: 2100,
            timelineYear: 0,
            scripts: [{ title: 'Latin', value: 'latin' }],
            texts: [],
            locs: [],
            firstWords: [],
            places: [],
        });

        render(<FilterSection />);
        
        const scriptSelect = screen.getByLabelText('Script');
        await userEvent.selectOptions(scriptSelect, 'latin');

        expect(mockSetters.setScriptFilter).toHaveBeenCalledWith('latin');
    });

    it('triggers setYearType when Year Type select value changes', async () => {
        render(<FilterSection />);
        
        const yearTypeSelect = screen.getByLabelText('Year Type');
        await userEvent.selectOptions(yearTypeSelect, 'discovered');

        expect(mockSetters.setYearType).toHaveBeenCalledWith('discovered');
    });

    it('updates start year input and calls setTimelineStart on blur', async () => {
        render(<FilterSection />);
        
        const startYearInput = screen.getByLabelText('Start Year');
        
        await userEvent.clear(startYearInput);
        await userEvent.type(startYearInput, '100');
        await userEvent.tab(); // Triggers blur

        expect(mockSetters.setTimelineStart).toHaveBeenCalledWith(100);
    });

    it('updates end year input and calls setTimelineEnd on blur', async () => {
        render(<FilterSection />);
        
        const endYearInput = screen.getByLabelText('End Year');
        
        await userEvent.clear(endYearInput);
        await userEvent.type(endYearInput, '500');
        await userEvent.tab(); // Triggers blur

        expect(mockSetters.setTimelineEnd).toHaveBeenCalledWith(500);
    });

    it('calls setTimelineStart when Enter is pressed on start year input', async () => {
        render(<FilterSection />);
        
        const startYearInput = screen.getByLabelText('Start Year');
        
        await userEvent.clear(startYearInput);
        await userEvent.type(startYearInput, '150{Enter}');

        expect(mockSetters.setTimelineStart).toHaveBeenCalledWith(150);
    });

    it('calls setTimelineEnd when Enter is pressed on end year input', async () => {
        render(<FilterSection />);
        
        const endYearInput = screen.getByLabelText('End Year');
        
        await userEvent.clear(endYearInput);
        await userEvent.type(endYearInput, '600{Enter}');

        expect(mockSetters.setTimelineEnd).toHaveBeenCalledWith(600);
    });

    it('calls clearFilters on Clear All Filters button click', () => {
        render(<FilterSection />);

        const clearButton = screen.getByRole('button', { name: /clear all filters/i });
        fireEvent.click(clearButton);

        expect(mockSetters.clearFilters).toHaveBeenCalled();
    });

    it('displays temporal range with current values', () => {
        useFilterStore.mockReturnValue({
            ...mockSetters,
            type: '',
            script: '',
            text: '',
            firstWord: '',
            place: '',
            location: '',
            yearType: 'created',
            timelineStart: 100,
            timelineEnd: 500,
            timelineYear: 0,
            scripts: [],
            texts: [],
            locs: [],
            firstWords: [],
            places: [],
        });

        render(<FilterSection />);
        
        expect(screen.getByText('100 CE - 500 CE')).toBeInTheDocument();
    });

    it('shows All Types option in Type select', () => {
        render(<FilterSection />);
        
        const typeSelect = screen.getByLabelText('Type');
        expect(typeSelect.querySelector('option[value=""]')).toHaveTextContent('All Types');
    });

    it('shows All Scripts option in Script select', () => {
        render(<FilterSection />);
        
        const scriptSelect = screen.getByLabelText('Script');
        expect(scriptSelect.querySelector('option[value=""]')).toHaveTextContent('All Scripts');
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<FilterSection />);
            const heading = screen.getByRole('heading', { name: /filters/i });
            expect(heading).toBeInTheDocument();
            expect(heading.tagName).toBe('H2');
        });

        it('has all form inputs properly labeled', () => {
            render(<FilterSection />);
            
            // Check that all inputs have associated labels
            expect(screen.getByLabelText('Start Year')).toBeInTheDocument();
            expect(screen.getByLabelText('End Year')).toBeInTheDocument();
            expect(screen.getByLabelText('Year Type')).toBeInTheDocument();
            expect(screen.getByLabelText('Type')).toBeInTheDocument();
            expect(screen.getByLabelText('Script')).toBeInTheDocument();
            expect(screen.getByLabelText('First Word')).toBeInTheDocument();
            /*
             Removing these filters for now
            expect(screen.getByLabelText('Text')).toBeInTheDocument();
            expect(screen.getByLabelText('Place')).toBeInTheDocument();
            expect(screen.getByLabelText('Location')).toBeInTheDocument();*/
        });

        it('has accessible close button with aria-label when onClose is provided', () => {
            const mockOnClose = vi.fn();
            render(<FilterSection onClose={mockOnClose} />);
            
            // The button should have aria-label="Close filters" for screen reader accessibility
            const closeButton = screen.getByTitle('Close filters');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton).toHaveAttribute('aria-label', 'Close filters');
        });

        it('has accessible Clear All Filters button', () => {
            render(<FilterSection />);
            const clearButton = screen.getByRole('button', { name: /clear all filters/i });
            expect(clearButton).toBeInTheDocument();
            expect(clearButton).toBeVisible();
        });

        it('all number inputs have proper min and max attributes', () => {
            render(<FilterSection />);
            
            const startYearInput = screen.getByLabelText('Start Year');
            const endYearInput = screen.getByLabelText('End Year');
            
            expect(startYearInput).toHaveAttribute('type', 'number');
            expect(startYearInput).toHaveAttribute('min');
            expect(startYearInput).toHaveAttribute('max');
            
            expect(endYearInput).toHaveAttribute('type', 'number');
            expect(endYearInput).toHaveAttribute('min');
            expect(endYearInput).toHaveAttribute('max');
        });

        it('all select elements are keyboard accessible', async () => {
            render(<FilterSection />);
            
            const typeSelect = screen.getByLabelText('Type');
            act(() => {
                typeSelect.focus();
            });
            expect(typeSelect).toHaveFocus();
            
            // Can navigate with arrow keys
            await userEvent.keyboard('{ArrowDown}');
            expect(typeSelect).toHaveFocus();
        });

        it('has proper focus management for inputs', async () => {
            render(<FilterSection />);
            
            const startYearInput = screen.getByLabelText('Start Year');
            await userEvent.click(startYearInput);
            expect(startYearInput).toHaveFocus();
        });

        it('has semantic HTML structure', () => {
            render(<FilterSection />);
            
            // Check for proper use of labels
            const labels = screen.getAllByText(/^(Start Year|End Year|Year Type|Type|Script|First Word|Text|Place|Location|Temporal Range)$/i);
            expect(labels.length).toBeGreaterThan(0);
        });

        it('has accessible button text (not just icons)', () => {
            render(<FilterSection />);
            
            // Clear All Filters button should have visible text
            const clearButton = screen.getByRole('button', { name: /clear all filters/i });
            expect(clearButton).toHaveTextContent('Clear All Filters');
        });

        it('close button is keyboard accessible when present', async () => {
            const mockOnClose = vi.fn();
            render(<FilterSection onClose={mockOnClose} />);
            
            const closeButton = screen.getByTitle('Close filters');
            closeButton.focus();
            expect(closeButton).toHaveFocus();
            
            await userEvent.keyboard('{Enter}');
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
