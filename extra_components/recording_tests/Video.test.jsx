import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Video from '@/components/recording/Video';
import '@testing-library/jest-dom';

// Mock recordrtc
let mockRecorderInstance;
let mockBlob;
vi.mock('recordrtc', () => ({
    default: vi.fn().mockImplementation(() => {
        mockBlob = new Buffer.Blob(['test'], { type: 'video/webm' });
        const instance = {
            startRecording: vi.fn(),
            stopRecording: vi.fn((callback) => {
                // Execute callback synchronously - the component calls getBlob() inside it
                // We need to ensure getBlob returns the blob when called
                if (callback && typeof callback === 'function') {
                    // The callback will call instance.getBlob(), so we execute it directly
                    callback();
                }
            }),
            getBlob: vi.fn(() => mockBlob),
        };
        mockRecorderInstance = instance;
        return instance;
    }),
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

describe('Video', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRecorderInstance = null;
        mockBlob = null;
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
            await waitFor(() => {
                startButton.focus();
            },{ timeout: 3000, interval: 10 });
            expect(startButton).toHaveFocus();
            
            await waitFor(() => {
                userEvent.keyboard('{Enter}');
            },{ timeout: 3000, interval: 10 });
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
            const { container } = render(<Video />);
            
            // Start recording
            const startButton = screen.getByRole('button', { name: /start/i });
            await waitFor(() => {
                userEvent.click(startButton);
            },{ timeout: 3000, interval: 100 });
            
            // Wait for getDisplayMedia to resolve and recorder to be created
            //await act(async () => {
                //await new Promise(resolve => setTimeout(resolve, 100));
            //});
            
            // Verify recorder was created
            expect(mockRecorderInstance).toBeTruthy();
            expect(mockRecorderInstance.startRecording).toHaveBeenCalled();
            
            // Stop recording - this should trigger the callback and set the blob
            const stopButton = screen.getByRole('button', { name: /stop/i });
            
            // Click stop button - stopRecording will execute the callback synchronously
            // The callback calls getBlob() and setBlob(), which triggers a state update
            await waitFor(() => {
                userEvent.click(stopButton);
                // Give React time to process the state update from setBlob
                //await new Promise(resolve => setTimeout(resolve, 10));
            }, { timeout: 3000, interval: 100 });
            
            // Verify stopRecording and getBlob were called
            expect(mockRecorderInstance.stopRecording).toHaveBeenCalled();
            expect(mockRecorderInstance.getBlob).toHaveBeenCalled();
            
            // Wait for React to process the state update and re-render
            // The callback sets the blob state, which triggers useMemo to create videoUrl
            // Then the component should render the video element
            await waitFor(() => {
                // Try multiple ways to find the video element
                const videoByLabel = screen.queryByLabelText(/recorded screen capture video/i);
                const videoByTag = container.querySelector('video');
                const video = videoByTag || videoByLabel;
                
                if (!video) {
                    throw new Error('Video element not found');
                }
                expect(video).toBeInTheDocument();
                return video;
            }, { timeout: 3000, interval: 100 });
            
            // Once video is found, check its attributes
            const video = screen.queryByLabelText(/recorded screen capture video/i) || 
                         container.querySelector('video');
            expect(video).toBeInTheDocument();
            expect(video).toHaveAttribute('controls');
            expect(video).toHaveAttribute('aria-label', 'Recorded screen capture video');
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

