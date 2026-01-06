import React, { useEffect, useState, memo } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { convertYearTypetoView } from '@/utilities/UtilityFunctions'
import { useFilterStore } from '@/stores/FilterStore';

// TODO - Add breakpoints for smaller windows
// TODO - make it look more like a timeline - ticks?

const TimelineSlider = memo(function TimelineSlider({ onValueChange }) {
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(2100)

    const { yearType, timelineStart, timelineEnd, timelineYear, setTimelineYear, playAnimation, setPlayAnimation, animationSpeed, animationStep, setAnimationSpeed, setAnimationStep } = useFilterStore(
        useShallow((state) => ({ 
            yearType: state.yearType, 
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
            timelineYear: state.timelineYear,
            setTimelineYear: state.setTimelineYear,
            playAnimation: state.playAnimation,
            setPlayAnimation: state.setPlayAnimation,
            animationSpeed: state.animationSpeed,
            animationStep: state.animationStep,
            setAnimationSpeed: state.setAnimationSpeed,
            setAnimationStep: state.setAnimationStep,
        })),
    )
    // Set min from filter change
    useEffect(() => {
        if (timelineStart == null || typeof timelineStart == 'string') {
            setMin(0)
        } else {
            setMin(timelineStart)
        }
    }, [timelineStart]);

    // Set max from filter change
    useEffect(() => {
    if (timelineEnd == null || typeof timelineEnd == 'string') {
        setMax(2100)
    } else {
        setMax(timelineEnd)
    }
    }, [timelineEnd]);

    // Reset timeline year to min when min/max changes, but only if current year is outside new range
    useEffect(() => {
        // Only reset if the current year is outside the valid range
        if (timelineYear < min || timelineYear > max) {
            setTimelineYear(min);
            if (onValueChange) {
                onValueChange(min);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max]); // Reset timeline to beginning when start or end is changed

    const handleChange = (event) => {
        const newValue = parseInt(event.target.value);
        // Stop animation when user manually changes the slider
        if (playAnimation) {
            setPlayAnimation(false);
        }
        setTimelineYear(newValue); // Update store
        if (onValueChange) {
            onValueChange(newValue);
        }
    }

    const playAnim = () => {
        setPlayAnimation(!playAnimation);
    }

    const handleSpeedChange = (event) => {
        const newSpeed = parseInt(event.target.value);
        setAnimationSpeed(newSpeed);
    }

    const handleStepChange = (event) => {
        const newStep = parseInt(event.target.value);
        if (!isNaN(newStep) && newStep >= 1 && newStep <= 1000) {
            setAnimationStep(newStep);
        }
    }
    
    return (
        <div className="space-y-3">
            <div className="text-sm text-amber-900 font-semibold">
                Timeline - {convertYearTypetoView(yearType)}
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={playAnim}
                    className="px-3 py-1 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors text-sm"
                    aria-label={playAnimation ? "Stop timeline animation" : "Play timeline animation"}
                >
                    {!playAnimation ? "Play" : "Stop"}
                </button>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={timelineYear}
                    onChange={handleChange}
                    onClick={(e) => {
                        // Stop animation when user clicks on the slider
                        if (playAnimation) {
                            setPlayAnimation(false);
                        }
                    }}
                    aria-label={`timeline-${yearType} year slider`}
                    aria-describedby="year-display"
                    className="flex-1 accent-amber-800"
                />
                <div id="year-display" className="text-sm text-amber-900 min-w-[80px]">
                    Year: {timelineYear}
                </div>
            </div>
            {/* Animation Controls */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-amber-200">
                <div className="space-y-2">
                    <label htmlFor="animation-speed" className="block text-xs font-semibold text-amber-900">
                        Animation Speed
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="animation-speed"
                            type="range"
                            min="100"
                            max="2000"
                            step="100"
                            value={animationSpeed}
                            onChange={handleSpeedChange}
                            aria-label="Animation speed in milliseconds"
                            aria-describedby="speed-display"
                            className="flex-1 accent-amber-800"
                        />
                        <div id="speed-display" className="text-xs text-amber-700 min-w-[60px]">
                            {animationSpeed}ms
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label htmlFor="animation-step" className="block text-xs font-semibold text-amber-900">
                        Year Step
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="animation-step"
                            type="number"
                            min="1"
                            max="1000"
                            value={animationStep}
                            onChange={handleStepChange}
                            aria-label="Number of years to increment per animation step"
                            aria-describedby="step-display"
                            className="w-full px-2 py-1 border-2 border-amber-300 rounded focus:border-amber-600 focus:outline-none text-sm"
                        />
                        <div id="step-display" className="text-xs text-amber-700 min-w-[40px]">
                            years
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default TimelineSlider;
