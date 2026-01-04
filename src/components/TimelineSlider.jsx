import React, { useEffect, useState, memo } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { convertYearTypetoView } from '@/utilities/UtilityFunctions'
import { useFilterStore } from '@/stores/FilterStore';
import { useMapStore} from '@/stores/MapStore'

// TODO - Add breakpoints for smaller windows
// TODO - Stop animation when slider clicked
// TODO - make it look more like a timeline - ticks

const TimelineSlider = memo(function TimelineSlider({ onValueChange }) {
    const [playAnimation, setPlayAnimation] = useState(false)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(2100)

    const { yearType, timelineStart, timelineEnd, timelineYear, setTimelineYear } = useFilterStore(
        useShallow((state) => ({ 
            yearType: state.yearType, 
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
            timelineYear: state.timelineYear,
            setTimelineYear: state.setTimelineYear,
        })),
    )

    const { setStorePlayAnimation } = useMapStore(
        useShallow((state) => ({ 
          setStorePlayAnimation: state.setStorePlayAnimation,
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

    //setStorePlayAnimation(playAnim)

    useEffect(() => {
        // TODO: Change rate of animation?
        //    - through filters?
        if (!playAnimation) {
            return; // Don't set up interval if not playing
        }

        const anim = setInterval(() => {
            // Read current value directly from store to avoid closure issues
            const state = useFilterStore.getState();
            const currentYear = state.timelineYear;
            const currentMin = state.timelineStart;
            const currentMax = state.timelineEnd;
            
            if (currentYear >= currentMax) {
                setTimelineYear(currentMin); // Update store
                if (onValueChange) {
                    onValueChange(currentMin);
                }
            } else {
                const nextYear = currentYear + 10;
                setTimelineYear(nextYear); // Update store
                if (onValueChange) {
                    onValueChange(nextYear);
                }
            }
        }, 500);

        return () => {
            clearInterval(anim);
        };
    }, [playAnimation]) // Depend on playAnimation and stable functions
    
    return (
        <div className="space-y-3">
            <div className="text-sm text-amber-900 font-semibold">
                Timeline - {convertYearTypetoView(yearType)}
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={playAnim}
                    className="px-3 py-1 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors text-sm"
                    aria-label="play/stop button"
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
                    className="flex-1 accent-amber-800"
                />
                <div className="text-sm text-amber-900 min-w-[80px]">
                    Year: {timelineYear}
                </div>
            </div>
        </div>
    );
});

export default TimelineSlider;
