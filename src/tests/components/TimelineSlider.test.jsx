import TimelineSlider from '@/components/TimelineSlider'
import React from 'react';
import { expect, describe, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { useFilterStore } from '@/stores/FilterStore';

// Mock zustand's useShallow - it should just pass through the selector
// The actual shallow equality checking happens in Zustand's useStore hook
vi.mock('zustand/react/shallow', () => ({
    useShallow: (selector) => selector,
}));

// Mock FilterStore
vi.mock('@/stores/FilterStore', () => ({
    useFilterStore: vi.fn(),
}));

// Mock UtilityFunctions
vi.mock('@/utilities/UtilityFunctions', () => ({
    convertYearTypetoView: (type) => {
        if (type === 'created') return 'Created year';
        if (type === 'discovered') return 'Discovered year';
        return type;
    },
}));

describe('TimelineSlider', () => {
    let mockStoreState;
    let mockSetPlayAnimation;
    let mockSetTimelineYear;

    beforeEach(() => {
        vi.clearAllMocks();
        
        mockStoreState = {
            yearType: 'created',
            timelineStart: 0,
            timelineEnd: 2100,
            timelineYear: 0,
            playAnimation: false,
        };

        // Make setters actually update the mock state
        mockSetPlayAnimation = vi.fn((value) => {
            mockStoreState.playAnimation = value;
        });
        mockSetTimelineYear = vi.fn((value) => {
            mockStoreState.timelineYear = value;
        });

        mockStoreState.setTimelineYear = mockSetTimelineYear;
        mockStoreState.setPlayAnimation = mockSetPlayAnimation;

        useFilterStore.mockImplementation((selector) => {
            // Always return a fresh object so useShallow can detect changes
            // This simulates Zustand's behavior where each call gets fresh state
            const state = {
                yearType: mockStoreState.yearType,
                timelineStart: mockStoreState.timelineStart,
                timelineEnd: mockStoreState.timelineEnd,
                timelineYear: mockStoreState.timelineYear,
                setTimelineYear: mockStoreState.setTimelineYear,
                playAnimation: mockStoreState.playAnimation,
                setPlayAnimation: mockStoreState.setPlayAnimation,
            };
            // Call the selector (which is wrapped by useShallow in the component)
            // useShallow does shallow equality, but since we create a new object,
            // the component should see the updated values
            return selector(state);
        });
    });
    it('renders correctly', () => {
        const onChange = () => {}
        render(<TimelineSlider onValueChange={onChange} />);
        const title = screen.getByText('Timeline - Created year');
        expect(title).toBeInTheDocument();
        const playButton = screen.getByText('Play');
        expect(playButton).toBeInTheDocument();
        const slider = screen.getByLabelText('timeline-created year slider');
        expect(slider).toBeInTheDocument();
        expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 0');
    })
    describe('Buttons', () => {
        it('starts animation', async () => {
            const onChange = vi.fn();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            
            const playButton = screen.getByText('Play');
            expect(screen.getByRole('button')).toHaveTextContent('Play');
            
            await act(async () => {
                fireEvent.click(playButton);
            });
            
            // Verify setter was called and state was updated
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(true);
            expect(mockStoreState.playAnimation).toBe(true);
            
            // Force rerender with updated state - use a key to force fresh render
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            
            // The component should now see the updated state
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
            
            // Simulate animation incrementing the year
            // Note: The actual animation logic would need to be tested separately
            // For now, we'll manually update the year to simulate animation
            await act(async () => {
                mockSetTimelineYear(10);
            });
            
            // Wait a bit, then rerender to pick up the year change
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 0));
            });
            rerender(<TimelineSlider onValueChange={onChange} />);
            
            await waitFor(() => {
                expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 10');
            }, { timeout: 3000 });
        })
        it('stops animation', async () => {
            const onChange = vi.fn();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            
            const playButton = screen.getByRole('button');
            
            // Start animation
            await act(async () => {
                fireEvent.click(playButton);
            });
            
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(true);
            expect(mockStoreState.playAnimation).toBe(true);
            
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
            
            // Simulate animation running
            await act(async () => {
                mockSetTimelineYear(10);
            });
            
            expect(mockStoreState.timelineYear).toBe(10);
            rerender(<TimelineSlider key="test-2" onValueChange={onChange} />);
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 10');
            
            // Stop animation - get fresh button reference after state update
            // Clear previous calls to see only the new call
            mockSetPlayAnimation.mockClear();
            const stopButton = screen.getByRole('button');
            await act(async () => {
                fireEvent.click(stopButton);
            });
            
            // The component should read playAnimation as true (from the rerender)
            // So it calls setPlayAnimation(!true) = setPlayAnimation(false)
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(false);
            expect(mockStoreState.playAnimation).toBe(false);
            
            rerender(<TimelineSlider key="test-3" onValueChange={onChange} />);
            expect(screen.getByRole('button')).toHaveTextContent('Play');
            
            // Year should remain at 10 after stopping
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 10');
        })
    })
    describe('Slider', () => {
        it('changes postion when clicked', async () => {
            const onChange = vi.fn();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            
            const slider = screen.getByLabelText('timeline-created year slider');
            
            await act(async () => {
                fireEvent.change(slider, { target: { value: '20' } });
            });
            
            expect(mockSetTimelineYear).toHaveBeenCalledWith(20);
            expect(onChange).toHaveBeenCalledWith(20);
            expect(mockStoreState.timelineYear).toBe(20);
            
            // Rerender to pick up the state change
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 20');
        })
        it('changes position when clicked and animation is playing', async () => {
            const onChange = vi.fn();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            const playButton = screen.getByText('Play');
            
            // Start animation
            await act(async () => {
                fireEvent.click(playButton);
            });
            
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(true);
            expect(mockStoreState.playAnimation).toBe(true);
            
            // Rerender to pick up animation state
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
            
            // Simulate animation running - set year to 20
            await act(async () => {
                mockSetTimelineYear(20);
            });
            
            expect(mockStoreState.timelineYear).toBe(20);
            rerender(<TimelineSlider key="test-2" onValueChange={onChange} />);
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 20');
            
            // Clear previous calls to verify only the slider change calls
            mockSetPlayAnimation.mockClear();
            mockSetTimelineYear.mockClear();
            onChange.mockClear();
            
            // Now click/change the slider while animation is playing
            const currentSlider = screen.getByLabelText('timeline-created year slider');
            await act(async () => {
                // Fire both change and click events to simulate user interaction
                fireEvent.change(currentSlider, { target: { value: '50' } });
                fireEvent.click(currentSlider);
            });
            
            // Verify that animation was stopped (should be called by both onChange and onClick)
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(false);
            expect(mockStoreState.playAnimation).toBe(false);
            
            // Verify that timeline year was set to the clicked position
            expect(mockSetTimelineYear).toHaveBeenCalledWith(50);
            expect(mockStoreState.timelineYear).toBe(50);
            expect(onChange).toHaveBeenCalledWith(50);
            
            // Rerender to pick up the state changes
            rerender(<TimelineSlider key="test-3" onValueChange={onChange} />);
            
            // Verify the UI reflects the changes
            expect(screen.getByRole('button')).toHaveTextContent('Play'); // Animation stopped
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 50'); // Year is at clicked position
            
            // Verify it stays at that position (simulate a bit more time passing)
            await act(async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
            });
            
            rerender(<TimelineSlider key="test-4" onValueChange={onChange} />);
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 50'); // Still at 50
        })
    })

    describe('Accessibility', () => {
        it('has accessible slider with proper aria-label', () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            expect(slider).toBeInTheDocument();
            expect(slider).toHaveAttribute('type', 'range');
            expect(slider).toHaveAttribute('min');
            expect(slider).toHaveAttribute('max');
        });

        it('has accessible play/stop button with aria-label', () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            // Button should have a descriptive aria-label that changes with state
            const playButton = screen.getByRole('button', { name: /play timeline animation/i });
            expect(playButton).toBeInTheDocument();
            expect(playButton).toHaveAttribute('aria-label', 'Play timeline animation');
        });

        it('play button has descriptive text that changes with state', async () => {
            const onChange = vi.fn();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            
            const playButton = screen.getByRole('button');
            expect(playButton).toHaveTextContent('Play');
            
            await act(async () => {
                fireEvent.click(playButton);
            });
            
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(true);
            expect(mockStoreState.playAnimation).toBe(true);
            
            // Rerender to pick up the state change
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
        });

        it('slider is keyboard accessible', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            
            slider.focus();
            expect(slider).toHaveFocus();
            
            // Can change value with arrow keys
            await userEvent.keyboard('{ArrowRight}');
            expect(slider).toHaveFocus();
        });

        it('displays current year value in accessible format', () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            // Year value should be displayed and associated with slider via aria-describedby
            const slider = screen.getByLabelText('timeline-created year slider');
            expect(slider).toHaveAttribute('aria-describedby', 'year-display');
            
            const yearDisplay = screen.getByText(/Year:/);
            expect(yearDisplay).toBeInTheDocument();
            expect(yearDisplay.textContent).toMatch(/Year:\s*\d+/);
            expect(yearDisplay).toHaveAttribute('id', 'year-display');
        });

        it('has proper min and max values on slider', () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            
            expect(slider).toHaveAttribute('min', '0');
            expect(slider).toHaveAttribute('max', '2100');
        });

        it('button is keyboard accessible', async () => {
            const onChange = vi.fn();
            const user = userEvent.setup();
            const { rerender } = render(<TimelineSlider onValueChange={onChange} />);
            
            const playButton = screen.getByRole('button');
            
            playButton.focus();
            expect(playButton).toHaveFocus();
            
            await act(async () => {
                await user.keyboard('{Enter}');
            });
            
            expect(mockSetPlayAnimation).toHaveBeenCalledWith(true);
            expect(mockStoreState.playAnimation).toBe(true);
            
            // Rerender to pick up the state change
            rerender(<TimelineSlider key="test-1" onValueChange={onChange} />);
            
            // The component should now see the updated state
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
        });
    })
})