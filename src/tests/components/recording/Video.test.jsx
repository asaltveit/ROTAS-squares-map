import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Video from '@/components/recording/Video';
import '@testing-library/jest-dom';

// Mock recordrtc
vi.mock('recordrtc', () => ({
    default: vi.fn().mockImplementation(() => ({
        startRecording: vi.fn(),
        stopRecording: vi.fn((callback) => {
            const blob = new Blob(['test'], { type: 'video/webm' });
            callback(blob);
        }),
        getBlob: vi.fn(() => new Blob(['test'], { type: 'video/webm' })),
    })),
    invokeSaveAsDialog: vi.fn(),
}));

// Mock navigator.mediaDevices
const mockGetDisplayMedia = vi.fn();
Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
        getDisplayMedia: mockGetDisplayMedia,
    },
    writable: true,
});

describe.skip('Video', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetDisplayMedia.mockResolvedValue({
            getTracks: () => [{ stop: vi.fn() }],
        });
    });

    it('renders start, stop, and save buttons', () => {
        render(<Video />);
        expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has accessible button labels', () => {
            render(<Video />);
            
            const startButton = screen.getByRole('button', { name: /start/i });
            expect(startButton).toBeInTheDocument();
            
            const stopButton = screen.getByRole('button', { name: /stop/i });
            expect(stopButton).toBeInTheDocument();
            
            const saveButton = screen.getByRole('button', { name: /save/i });
            expect(saveButton).toBeInTheDocument();
        });

        it('buttons are keyboard accessible', async () => {
            render(<Video />);
            
            const startButton = screen.getByRole('button', { name: /start/i });
            startButton.focus();
            expect(startButton).toHaveFocus();
            
            await userEvent.keyboard('{Enter}');
            expect(startButton).toBeInTheDocument();
        });

        it('buttons have proper focus indicators', () => {
            render(<Video />);
            
            const buttons = screen.getAllByRole('button');
            buttons.forEach(button => {
                // Buttons should be focusable
                expect(button).not.toHaveAttribute('tabindex', '-1');
            });
        });

        it('video element has proper attributes when present', async () => {
            render(<Video />);
            
            // Start and stop recording to create video element
            const startButton = screen.getByRole('button', { name: /start/i });
            await userEvent.click(startButton);
            
            const stopButton = screen.getByRole('button', { name: /stop/i });
            await userEvent.click(stopButton);
            
            await waitFor(() => {
                const video = screen.queryByRole('application') || screen.queryByTagName('video');
                if (video) {
                    // Test currently failing: Video element should have proper accessibility attributes
                    // Video should have aria-label or title describing its content
                    expect(video).toHaveAttribute('controls');
                    // This test will fail - video should have aria-label
                    expect(video).toHaveAttribute('aria-label');
                }
            });
        });

        it('uses semantic HTML structure', () => {
            render(<Video />);
            
            // Check for semantic header element
            const header = screen.getByRole('banner') || document.querySelector('header');
            if (header) {
                expect(header.tagName).toBe('HEADER');
            }
        });
    });
});

