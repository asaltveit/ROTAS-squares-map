import TimelineSlider from '../components/TimelineSlider'
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
        const stopButton = screen.getByText('Stop');
        expect(stopButton).toBeInTheDocument();
        const slider = screen.getByLabelText('timeline-created year slider');
        expect(slider).toBeInTheDocument();
        const label = screen.getByText('Year: 0'); // needs the number included to be found
        expect(label).toBeInTheDocument();
    })
    describe('Buttons', () => {
        it('starts animation', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const playButton = screen.getByText('Play');
            act(() => {
                /* fire events that update state */
                fireEvent.click(playButton)
            });
            await new Promise((r) => setTimeout(r, 1500));
            expect(screen.getByText('Year: 10')).toBeInTheDocument();
        })
        it('stops animation', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const playButton = screen.getByText('Play');
            act(() => {
                /* fire events that update state */
                fireEvent.click(playButton)
            });
            await new Promise((r) => setTimeout(r, 1500));
            const stopButton = screen.getByText('Stop');
            act(() => {
                /* fire events that update state */
                fireEvent.click(stopButton)
            });
            await new Promise((r) => setTimeout(r, 1000));
            expect(screen.getByText('Year: 10')).toBeInTheDocument();
        })
    })
    describe('Slider', () => {
        it('changes postion when clicked', async () => {
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            act(() => {
                /* fire events that update state */
                fireEvent.change(slider, { target: { value: 20 } });
            });
            expect(screen.getByText('Year: 20')).toBeInTheDocument();
        })
        it.skip('changes position when clicked and animation is playing', async () => {
            // TODO: Isn't working for real slider
            const onChange = () => {}
            render(<TimelineSlider onValueChange={onChange} />);
            const slider = screen.getByLabelText('timeline-created year slider');
            const playButton = screen.getByText('Play');
            act(() => {
                /* fire events that update state */
                fireEvent.click(playButton)
            });
            await new Promise((r) => setTimeout(r, 1500));
            act(() => {
                /* fire events that update state */
                fireEvent.change(slider, { target: { value: 50 } });
            });
            await new Promise((r) => setTimeout(r, 1500));
            expect(screen.getByText('Year: 50')).toBeInTheDocument();
            
        })
    })
})