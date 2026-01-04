import TimelineSlider from '@/components/TimelineSlider'
import React from 'react';
import { expect, describe, it } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react'


describe('TimelineSlider', () => {
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
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const playButton = screen.getByText('Play');
            expect(screen.getByRole('button')).toHaveTextContent('Play');
            act(() => {
                fireEvent.click(playButton)
            });
            expect(screen.getByRole('button')).toHaveTextContent('Stop');
            await new Promise((r) => setTimeout(r, 1400));
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 10');
        })
        it('stops animation', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            act(() => {
                fireEvent.click(screen.getByRole('button'))
            });
            await new Promise((r) => setTimeout(r, 1400));
            act(() => {
                fireEvent.click(screen.getByRole('button'))
            });
            await new Promise((r) => setTimeout(r, 1000));
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 10');
        })
    })
    describe('Slider', () => {
        it('changes postion when clicked', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            act(() => {
                fireEvent.change(slider, { target: { value: 20 } });
            });
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 20');
        })
        it.skip('changes position when clicked and animation is playing', async () => {
            // TODO: Isn't working for real slider (?)
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            const playButton = screen.getByText('Play');
            act(() => {
                fireEvent.click(playButton)
            });
            await new Promise((r) => setTimeout(r, 1500));
            act(() => {
                fireEvent.change(slider, { target: { value: 50 } });
            });
            await new Promise((r) => setTimeout(r, 1500));
            expect(screen.getByText(/Year:/)).toHaveTextContent('Year: 50');
        })
    })
})