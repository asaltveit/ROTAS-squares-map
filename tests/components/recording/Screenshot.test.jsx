import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Screenshot from '@/components/recording/Screenshot';
import { useMapStore } from '@/stores/MapStore';
import '@testing-library/jest-dom';

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

describe.skip('Screenshot', () => {
    const mockScreenRef = {
        current: document.createElement('div'),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useMapStore.mockReturnValue({
            scrollToMap: vi.fn(),
        });
    });

    it('renders download button', () => {
        render(<Screenshot screenRef={mockScreenRef} />);
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    // Accessibility tests
    describe('Accessibility', () => {
        it('has accessible button label', () => {
            render(<Screenshot screenRef={mockScreenRef} />);
            
            const downloadButton = screen.getByRole('button', { name: /download/i });
            expect(downloadButton).toBeInTheDocument();
            expect(downloadButton).toBeVisible();
        });

        it('button is keyboard accessible', async () => {
            render(<Screenshot screenRef={mockScreenRef} />);
            
            const downloadButton = screen.getByRole('button', { name: /download/i });
            downloadButton.focus();
            expect(downloadButton).toHaveFocus();
            
            await userEvent.keyboard('{Enter}');
            expect(downloadButton).toBeInTheDocument();
        });

        it('button has proper focus indicators', () => {
            render(<Screenshot screenRef={mockScreenRef} />);
            
            const downloadButton = screen.getByRole('button', { name: /download/i });
            // Button should be focusable
            expect(downloadButton).not.toHaveAttribute('tabindex', '-1');
        });

        it('uses semantic HTML structure', () => {
            render(<Screenshot screenRef={mockScreenRef} />);
            
            // Material-UI Button should render as button element
            const button = screen.getByRole('button');
            expect(button.tagName).toBe('BUTTON');
        });
    });
});

