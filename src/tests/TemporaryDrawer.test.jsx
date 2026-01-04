import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TemporaryDrawer from '@/components/TemporaryDrawer';

describe('TemporaryDrawer', () => {
    const mockChildren = [
        {
            icon: '🧪',
            header: 'Test Header',
            body: 'Test Body',
        },
    ];

    it('renders drawer toggle button', () => {
        render(<TemporaryDrawer children={mockChildren} />);
        expect(screen.getByText(/Open drawer/i)).toBeInTheDocument();
    });

    it('opens drawer on button click and shows accordion content', () => {
        render(<TemporaryDrawer children={mockChildren} />);
        act(() => {
            fireEvent.click(screen.getByText(/Open drawer/i));
        });
        expect(screen.getByText(/Test Header/)).toBeInTheDocument();
        act(() => {
            fireEvent.click(screen.getByText(/Test Header/));
        });
        expect(screen.getByText(/Test Body/)).toBeVisible();
    });
});
