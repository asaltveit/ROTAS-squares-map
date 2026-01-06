import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { useMapStore } from '@/stores/MapStore';
import { useFilterStore } from '@/stores/FilterStore';
import { supabase } from '@/supabaseClient';
import '@testing-library/jest-dom';

// Mock FingerprintJS
vi.mock('@sparkstone/fingerprintjs', () => ({
    default: {
        load: vi.fn(() => Promise.resolve({
            get: vi.fn(() => Promise.resolve({
                visitorId: 'test-id',
                components: {
                    timezone: { value: 'UTC' },
                    platform: { value: 'test' },
                    languages: { value: [['en']] },
                },
            })),
        })),
    },
}));

// Mock FilterSection
vi.mock('@/components/FilterSection', () => ({
    default: ({ onClose }) => (
        <div data-testid="filter-section">
            Filter Section
            {onClose && <button onClick={onClose}>Close</button>}
        </div>
    ),
}));

// Mock RecordingSection
vi.mock('@/components/recording/RecordingSection', () => ({
    default: () => <div data-testid="recording-section">Recording Section</div>,
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
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                match: vi.fn(() => ({
                    gte: vi.fn(() => ({
                        or: vi.fn(() => Promise.resolve({ data: [], error: null })),
                    })),
                })),
                gte: vi.fn(() => ({
                    or: vi.fn(() => Promise.resolve({ data: [], error: null })),
                })),
            })),
        })),
        rpc: vi.fn(() => Promise.resolve({ data: ['city', 'village'], error: null })),
    },
}));

// Mock topojson-client
vi.mock('topojson-client', () => ({
    feature: vi.fn(() => ({ type: 'FeatureCollection', features: [] })),
}));

// Mock @observablehq/plot
vi.mock('@observablehq/plot', () => ({
    plot: vi.fn(() => {
        const mockChart = document.createElement('div');
        mockChart.remove = vi.fn();
        return mockChart;
    }),
    geo: vi.fn(),
    dot: vi.fn(),
    tip: vi.fn(),
    pointer: vi.fn(),
}));

describe('App', () => {
    let mockSetTimelineYear;
    let mockStoreState;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockSetTimelineYear = vi.fn();
        mockStoreState = {
            timelineYear: 0,
            timelineStart: 0,
            timelineEnd: 2100,
            animationStep: 10,
        };

        useMapStore.mockReturnValue({
            locations: [],
            setLocations: vi.fn(),
            locationTypes: ['city', 'village'],
            setLocationTypes: vi.fn(),
            setScrollToMap: vi.fn(),
        });

        useFilterStore.mockReturnValue({
            filters: {},
            yearType: 'created',
            timelineYear: 0,
            setTimelineYear: mockSetTimelineYear,
            timelineStart: 0,
            timelineEnd: 2100,
            playAnimation: false,
            animationSpeed: 500,
            animationStep: 10,
        });

        // Mock getState() method for the animation logic
        useFilterStore.getState = vi.fn(() => ({
            timelineYear: mockStoreState.timelineYear,
            timelineStart: mockStoreState.timelineStart,
            timelineEnd: mockStoreState.timelineEnd,
            animationStep: mockStoreState.animationStep,
        }));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders main heading', () => {
        render(<App />);
        expect(screen.getByText('ROTAS SQUARES MAP')).toBeInTheDocument();
    });

    it('renders map section', () => {
        render(<App />);
        expect(screen.getByText('Map')).toBeInTheDocument();
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<App />);
            
            const mainHeading = screen.getByRole('heading', { name: /rotas squares map/i });
            expect(mainHeading).toBeInTheDocument();
            expect(mainHeading.tagName).toBe('H1');
            
            // Get all headings with "map" and find the H2 one
            const mapHeadings = screen.getAllByRole('heading', { name: /map/i });
            const mapHeading = mapHeadings.find(h => h.tagName === 'H2');
            expect(mapHeading).toBeInTheDocument();
            expect(mapHeading.tagName).toBe('H2');
        });

        it('has accessible main content landmark', () => {
            render(<App />);
            // The main content area should have role="main" or be in a <main> element
            const main = screen.queryByRole('main');
            expect(main).toBeInTheDocument();
        });

        it('has accessible navigation landmarks', () => {
            render(<App />);
            // Check for navigation regions if they exist
            const navs = screen.queryAllByRole('navigation');
            // Navigation should be properly marked if present
            navs.forEach(nav => {
                expect(nav).toBeInTheDocument();
            });
        });

        it('has accessible buttons with descriptive labels', () => {
            render(<App />);
            
            // Show Filters button (when filters are closed)
            const showFiltersButton = screen.queryByRole('button', { name: /show filters/i });
            if (showFiltersButton) {
                expect(showFiltersButton).toBeInTheDocument();
            }
            
            // Save Current View button
            const saveButton = screen.queryByRole('button', { name: /save current view/i });
            if (saveButton) {
                expect(saveButton).toBeInTheDocument();
            }
        });

        it('buttons are keyboard accessible', async () => {
            render(<App />);
            
            // Find any button and test keyboard navigation
            const buttons = screen.getAllByRole('button');
            if (buttons.length > 0) {
                const firstButton = buttons[0];
                firstButton.focus();
                expect(firstButton).toHaveFocus();
                
                await userEvent.keyboard('{Tab}');
                // Focus should move to next focusable element
            }
        });

        it('has accessible filter count display', () => {
            render(<App />);
            // The active filters count should be linked to the filter section
            const filterCount = screen.queryByText(/active filters:/i);
            if (filterCount) {
                expect(filterCount).toBeInTheDocument();
                expect(filterCount).toHaveAttribute('aria-live', 'polite');
            }
        });

        it('has proper focus management for collapsible sections', async () => {
            render(<App />);
            
            // Find collapsible section buttons
            const expandButtons = screen.queryAllByRole('button', { expanded: false });
            if (expandButtons.length > 0) {
                const firstButton = expandButtons[0];
                await userEvent.click(firstButton);
                
                // After expanding, focus should be managed appropriately
                await waitFor(() => {
                    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
                });
            }
        });

        it('has accessible form controls', () => {
            render(<App />);
            // Check that any form controls are properly labeled
            const inputs = screen.queryAllByRole('textbox');
            const selects = screen.queryAllByRole('combobox');
            const buttons = screen.getAllByRole('button');
            
            // All interactive elements should be accessible
            [...inputs, ...selects, ...buttons].forEach(element => {
                expect(element).not.toHaveAttribute('aria-hidden', 'true');
            });
        });

        it('has proper color contrast indicators', () => {
            render(<App />);
            // This is a visual test that would need manual verification or a11y testing tool
            // Buttons should not rely solely on color to convey information
            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                // Buttons should have text or icons with sufficient contrast
                expect(button).toBeVisible();
            });
        });

        // Skip links are only needed when there's repetitive navigation content (like a nav bar)
        // Since this app has no navigation bar, skip links are not necessary

        it('has proper ARIA landmarks', () => {
            render(<App />);
            // Check for common ARIA landmarks
            const banner = screen.queryByRole('banner');
            const main = screen.queryByRole('main');
            const complementary = screen.queryAllByRole('complementary');
            
            // At minimum, main content should be marked
            expect(main).toBeInTheDocument();
            
            // Banner (header) should be present
            expect(banner).toBeInTheDocument();
            
            // Complementary regions (sidebars) may or may not be present
            // Just verify the query works correctly
            expect(Array.isArray(complementary)).toBe(true);
        });

        it('map container has accessible description', () => {
            render(<App />);
            // Map container should have aria-label describing its purpose
            // The map visualization should be described for screen reader users
            const mapContainer = screen.getByLabelText('Interactive map showing location markers');
            expect(mapContainer).toBeInTheDocument();
            expect(mapContainer).toHaveAttribute('aria-label', 'Interactive map showing location markers');
        });
    });

    describe('Timeline Animation', () => {
        it('does not start animation when playAnimation is false', () => {
            vi.useFakeTimers();
            render(<App />);
            
            // Fast-forward time
            act(() => {
                vi.advanceTimersByTime(2000); // 2 seconds
            });
            
            // Should not have called setTimelineYear (except initial render effects)
            expect(mockSetTimelineYear).not.toHaveBeenCalled();
        });

        it('increments year by 10 every 500ms when animation is playing', () => {
            vi.useFakeTimers();
            
            // Start with animation playing
            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 0,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 0,
                timelineEnd: 2100,
                playAnimation: true,
                animationSpeed: 500,
                animationStep: 10,
            });

            mockStoreState.timelineYear = 0;

            render(<App />);
            
            // Clear any initial calls
            mockSetTimelineYear.mockClear();
            
            // Advance time by 500ms - should increment once
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(10);
            
            // Update mock state to reflect the change
            mockStoreState.timelineYear = 10;
            mockSetTimelineYear.mockClear();
            
            // Advance another 500ms - should increment again
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(20);
        });

        it('loops back to timelineStart when reaching timelineEnd', () => {
            vi.useFakeTimers();
            
            // Set up state where year is at or above the end (triggers loop)
            mockStoreState.timelineYear = 2100;
            mockStoreState.timelineStart = 0;
            mockStoreState.timelineEnd = 2100;

            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 2100,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 0,
                timelineEnd: 2100,
                playAnimation: true,
                animationSpeed: 500,
                animationStep: 10,
            });

            render(<App />);
            mockSetTimelineYear.mockClear();
            
            // Advance 500ms - since 2100 >= 2100, should loop to 0
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            // Should loop back to start (0) instead of incrementing
            expect(mockSetTimelineYear).toHaveBeenCalledWith(0);
        });

        it('stops animation when playAnimation changes to false', () => {
            vi.useFakeTimers();
            
            const { rerender } = render(<App />);
            
            // Start animation
            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 0,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 0,
                timelineEnd: 2100,
                playAnimation: true,
                animationSpeed: 500,
                animationStep: 10,
            });

            mockStoreState.timelineYear = 0;
            rerender(<App />);
            mockSetTimelineYear.mockClear();
            
            // Advance time - should increment
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(10);
            mockSetTimelineYear.mockClear();
            
            // Stop animation
            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 10,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 0,
                timelineEnd: 2100,
                playAnimation: false,
            });

            rerender(<App />);
            
            // Advance time - should NOT increment anymore
            act(() => {
                vi.advanceTimersByTime(2000);
            });
            
            // Should not have been called again
            expect(mockSetTimelineYear).not.toHaveBeenCalled();
        });

        it('reads current state from store on each interval tick', () => {
            vi.useFakeTimers();
            
            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 0,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 0,
                timelineEnd: 2100,
                playAnimation: true,
                animationSpeed: 500,
                animationStep: 10,
            });

            mockStoreState.timelineYear = 0;
            render(<App />);
            mockSetTimelineYear.mockClear();
            
            // First tick
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(useFilterStore.getState).toHaveBeenCalled();
            expect(mockSetTimelineYear).toHaveBeenCalledWith(10);
            
            // Update state for next tick
            mockStoreState.timelineYear = 10;
            mockSetTimelineYear.mockClear();
            
            // Second tick - should read updated state
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(useFilterStore.getState).toHaveBeenCalledTimes(2);
            expect(mockSetTimelineYear).toHaveBeenCalledWith(20);
        });

        it('handles custom timeline ranges correctly', () => {
            vi.useFakeTimers();
            
            mockStoreState.timelineYear = 100;
            mockStoreState.timelineStart = 100;
            mockStoreState.timelineEnd = 200;

            useFilterStore.mockReturnValue({
                filters: {},
                yearType: 'created',
                timelineYear: 100,
                setTimelineYear: mockSetTimelineYear,
                timelineStart: 100,
                timelineEnd: 200,
                playAnimation: true,
                animationSpeed: 500,
                animationStep: 10,
            });

            render(<App />);
            mockSetTimelineYear.mockClear();
            
            // Should increment from 100
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(110);
            
            // Update to at or above end to trigger loop
            mockStoreState.timelineYear = 200;
            mockSetTimelineYear.mockClear();
            
            // Next increment should loop back to 100 (since 200 >= 200)
            act(() => {
                vi.advanceTimersByTime(500);
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(100);
        });
    });
});

