import React, {useEffect, useState} from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Scrubber } from 'react-scrubber';
import 'react-scrubber/lib/scrubber.css';
import Slider from '@mui/material/Slider';
import { convertYearTypetoView } from '../utilities/UtilityFunctions'
import { useFilterStore } from '../utilities/FilterStore';

// TODO - Fix timeline moving when dragged

export default function TimelineSlider({ onValueChange}) {
    let anim;
    const [year, setYear] = useState(0);
    const [playAnimation, setPlayAnimation] = useState(false)

    const { yearType, timelineStart, timelineEnd } = useFilterStore(
        useShallow((state) => ({ 
            yearType: state.yearType, 
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
        })),
    )

    let min = timelineStart != null ? timelineStart : 0;
    let max = timelineEnd != null ? timelineEnd : 2100;

    // Reset start and label?
    useEffect(() => {
        setYear(min)
      }, [min]);

    const handleScrubStart = (value) => {
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    const handleScrubEnd = (value) => {
        setPlayAnimation(false)
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    /*const handleScrubChange = (value) => {
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }*/

    const handleChange = (event, newValue) => {
        setYear(newValue) // Math.ceil(value)
        onValueChange(newValue)
    }

    const playAnim = () => {
        setPlayAnimation(true)
    }

    useEffect(() => {
        // TODO: Change rate of animation?
        if (playAnimation) {
            let i = year; // start wherever it is
            anim = setInterval(() => {
                if (year == max) {
                    i = min;
                    setYear(min);
                    onValueChange(min);
                } else {
                    onValueChange(i);
                    setYear(i); // i++
                    i += 10
                }
            }, 500)
        }
        return () => clearTimeout(anim)
    }, [playAnimation])

    return (
        <>
            <div style={{ padding: '10px', backgroundColor: '#ffffff' }}>
                Timeline - {convertYearTypetoView(yearType)}
                <div>
                    <button style={{ display: 'inline-block', marginRight: '10px', padding: '7px' }} onClick={playAnim}> Play </button>
                    <button style={{ display: 'inline-block', marginRight: '10px', padding: '7px' }} onClick={() => setPlayAnimation(false)}> Stop </button>
                    <Slider
                        min={min}
                        max={max}
                        value={year}
                        aria-label={`timeline-${yearType} year`}
                        onChange={handleChange}
                        style={{ display: 'inline-block', width: '500px'}}
                    />
                    <div style={{ paddingLeft: '10px', display: 'inline-block'}}>
                        Year: {year}
                    </div>
                </div>
            </div>
        </>
    );
}

/*
<Scrubber
    min={min}
    max={max}
    value={year}
    onScrubStart={() => handleScrubStart}
    onScrubEnd={handleScrubEnd}
    onScrubChange={handleScrubChange}
    style={{ display: 'inline-block', width: '500px'}}
/>

*/