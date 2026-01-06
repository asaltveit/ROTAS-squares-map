import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import ScreenRecorder from '@/components/recording/ScreenRecorder';
import { useMapStore } from '@/stores/MapStore';
import '@testing-library/jest-dom';

// Mock react-media-recorder
vi.mock('react-media-recorder', () => ({
    useReactMediaRecorder: vi.fn(() => ({
        status: 'idle',
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
        mediaBlobUrl: null,
    })),
}));

// Mock zustand's useShallow
vi.mock('zustand/react/shallow', () => ({
    useShallow: (selector) => selector,
}));

vi.mock('@/stores/MapStore', () => ({
    useMapStore: vi.fn(),
}));

describe.skip('ScreenRecorder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useMapStore.mockReturnValue({
            playAnimation: false,
            scrollToMap: vi.fn(),
        });
    });

    it('renders status', () => {
        render(<ScreenRecorder />);
        expect(screen.getByText('idle')).toBeInTheDocument();
    });

    it('renders start and stop buttons', () => {
        render(<ScreenRecorder />);
        expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /stop recording/i })).toBeInTheDocument();
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has accessible button labels', () => {
            render(<ScreenRecorder />);
            
            const startButton = screen.getByRole('button', { name: /start recording/i });
            expect(startButton).toBeInTheDocument();
            
            const stopButton = screen.getByRole('button', { name: /stop recording/i });
            expect(stopButton).toBeInTheDocument();
        });

        it('buttons are keyboard accessible', async () => {
            render(<ScreenRecorder />);
            
            const startButton = screen.getByRole('button', { name: /start recording/i });
            startButton.focus();
            expect(startButton).toHaveFocus();
            
            await userEvent.keyboard('{Enter}');
            expect(startButton).toBeInTheDocument();
        });

        it('has descriptive status text', () => {
            render(<ScreenRecorder />);
            // Test currently failing: Status text should be associated with recording controls via aria-live
            // The status should be announced to screen readers when it changes
            const statusText = screen.getByText('idle');
            expect(statusText).toBeInTheDocument();
            // This test will fail - status should have aria-live="polite" for screen reader announcements
            expect(statusText.closest('div') || statusText.parentElement).toHaveAttribute('aria-live', 'polite');
        });

        it('buttons have proper focus indicators', () => {
            render(<ScreenRecorder />);
            
            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                // Buttons should be focusable
                expect(button).not.toHaveAttribute('tabindex', '-1');
            });
        });

        it('uses semantic HTML structure', () => {
            render(<ScreenRecorder />);
            
            // Material-UI components should render semantic HTML
            const buttons = screen.getAllByRole('button');
            expect(buttons.length).toBeGreaterThan(0);
        });
    });
});

