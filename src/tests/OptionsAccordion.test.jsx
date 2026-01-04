import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OptionsAccordion from '@/components/OptionsAccordion';

describe('OptionsAccordion', () => {
  const mockChildren = [
    {
      icon: '🔥',
      header: 'Header 1',
      body: 'Body content 1',
    },
    {
      icon: '🌊',
      header: 'Header 2',
      body: 'Body content 2',
    },
  ];

  it('renders all headers correctly', () => {
    render(<OptionsAccordion>{mockChildren}</OptionsAccordion>);
    expect(screen.getByText(/Header 1/)).toBeInTheDocument();
    expect(screen.getByText(/Header 2/)).toBeInTheDocument();
  });

  it('only expands one panel at a time', async () => {
    render(<OptionsAccordion>{mockChildren}</OptionsAccordion>);

    // Open first panel
    fireEvent.click(screen.getByText(/Header 1/));
    await waitFor(() => {
      expect(screen.getByText(/Body content 1/)).toBeVisible();
    });

    // Open second panel (should collapse first)
    fireEvent.click(screen.getByText(/Header 2/));
    await waitFor(() => {
      expect(screen.getByText(/Body content 2/)).toBeVisible();
      expect(screen.getByText(/Body content 1/)).not.toBeVisible();
    });
  });
});