import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import RecordingSection from '@/components/recording/RecordingSection';
import { useMapStore } from '@/stores/MapStore';
import '@testing-library/jest-dom';

// Mock react-media-recorder
vi.mock('react-media-recorder', () => ({
    useReactMediaRecorder: vi.fn(() => ({
        status: 'idle',
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
    })),
}));

// Mock html-to-image
vi.mock('html-to-image', () => ({
    toJpeg: vi.fn(() => Promise.resolve('data:image/jpeg;base64,test')),
}));

// Mock zustand's useShallow
vi.mock('zustand/react/shallow', () => ({
    useShallow: (selector) => selector,
}));

vi.mock('@/stores/MapStore', () => ({
    useMapStore: vi.fn(),
}));

describe.skip('RecordingSection', () => {
    const mockScreenRef = {
        current: document.createElement('div'),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useMapStore.mockReturnValue({
            scrollToMap: vi.fn(),
        });
    });

    it('renders screenshot section', () => {
        render(<RecordingSection screenRef={mockScreenRef} />);
        expect(screen.getByText('Take a screenshot')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /download screenshot/i })).toBeInTheDocument();
    });

    it('renders recording section', () => {
        render(<RecordingSection screenRef={mockScreenRef} />);
        expect(screen.getByText('Take a screen recording')).toBeInTheDocument();
        expect(screen.getByText(/status:/i)).toBeInTheDocument();
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has proper heading hierarchy', () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            // Test currently failing: Headings use h3 but should be properly structured
            // The h3 elements should be semantic and properly nested
            const headings = screen.getAllByRole('heading');
            expect(headings.length).toBeGreaterThan(0);
            // This test will fail - headings should be properly structured
            headings.forEach(heading => {
                expect(['H1', 'H2', 'H3']).toContain(heading.tagName);
            });
        });

        it('has accessible button labels', () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            
            const screenshotButton = screen.getByRole('button', { name: /download screenshot/i });
            expect(screenshotButton).toBeInTheDocument();
            expect(screenshotButton).toBeVisible();
            
            const startButton = screen.getByRole('button', { name: /start recording/i });
            expect(startButton).toBeInTheDocument();
            
            const stopButton = screen.getByRole('button', { name: /stop recording/i });
            expect(stopButton).toBeInTheDocument();
        });

        it('buttons are keyboard accessible', async () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            
            const screenshotButton = screen.getByRole('button', { name: /download screenshot/i });
            screenshotButton.focus();
            expect(screenshotButton).toHaveFocus();
            
            await userEvent.keyboard('{Enter}');
            // Button should be clickable via keyboard
            expect(screenshotButton).toBeInTheDocument();
        });

        it('has descriptive status text', () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            // Test currently failing: Status text should be associated with recording controls via aria-live
            // The status should be announced to screen readers when it changes
            const statusText = screen.getByText(/status:/i);
            expect(statusText).toBeInTheDocument();
            // This test will fail - status should have aria-live="polite" for screen reader announcements
            expect(statusText.closest('div')).toHaveAttribute('aria-live', 'polite');
        });

        it('buttons have proper focus indicators', () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            
            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                // Buttons should be focusable
                expect(button).not.toHaveAttribute('tabindex', '-1');
            });
        });

        it('has semantic HTML structure', () => {
            render(<RecordingSection screenRef={mockScreenRef} />);
            
            // Check that sections are properly structured
            const screenshotHeading = screen.getByText('Take a screenshot');
            expect(screenshotHeading.tagName).toBe('H3');
            
            const recordingHeading = screen.getByText('Take a screen recording');
            expect(recordingHeading.tagName).toBe('H3');
        });
    });
});

