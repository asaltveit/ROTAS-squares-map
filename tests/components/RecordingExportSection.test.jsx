import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import RecordingExportSection from '@/components/RecordingExportSection';
import { useFilterStore } from '@/stores/FilterStore';
import '@testing-library/jest-dom';

vi.mock('lucide-react', () => ({
    X: () => <svg data-testid="x-icon" />,
    Download: () => <svg data-testid="download-icon" />,
    Share: () => <svg data-testid="share-icon" />,
    Bookmark: () => <svg data-testid="bookmark-icon" />,
    Save: () => <svg data-testid="save-icon" />,
    ChevronDown: () => <svg data-testid="chevron-down-icon" />,
    ChevronUp: () => <svg data-testid="chevron-up-icon" />,
}));

vi.mock('zustand/react/shallow', () => ({
    useShallow: (selector) => selector,
}));

vi.mock('@/stores/FilterStore', () => ({
    useFilterStore: vi.fn(),
}));

describe('RecordingExportSection', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useFilterStore.mockReturnValue({
            filters: {},
        });
    });

    it('renders section title', () => {
        render(<RecordingExportSection onClose={vi.fn()} />);
        expect(screen.getByRole('heading', { name: /recording & export/i })).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        render(<RecordingExportSection onClose={onClose} />);

        await act(async () => {
            await userEvent.click(screen.getByRole('button', { name: /close recording and export/i }));
        });

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('expands and collapses recording session accordion', async () => {
        render(<RecordingExportSection onClose={vi.fn()} />);

        const recordingButton = screen.getByRole('button', { name: /recording session/i });
        expect(recordingButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('button', { name: /save current view/i })).not.toBeInTheDocument();

        await act(async () => {
            await userEvent.click(recordingButton);
        });

        expect(recordingButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: /save current view/i })).toBeInTheDocument();

        await act(async () => {
            await userEvent.click(recordingButton);
        });

        expect(recordingButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('button', { name: /save current view/i })).not.toBeInTheDocument();
    });

    it('expands and collapses export and share accordion', async () => {
        render(<RecordingExportSection onClose={vi.fn()} />);

        const exportButton = screen.getByRole('button', { name: /export & share/i });
        expect(exportButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('button', { name: /export as csv/i })).not.toBeInTheDocument();

        await act(async () => {
            await userEvent.click(exportButton);
        });

        expect(exportButton).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: /export as csv/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /export as pdf/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /share configuration/i })).toBeInTheDocument();

        await act(async () => {
            await userEvent.click(exportButton);
        });

        expect(exportButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('button', { name: /export as csv/i })).not.toBeInTheDocument();
    });
});
