import React, {useEffect, useState} from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Slider, Button, Box } from '@mui/material';
import { convertYearTypetoView } from '../utilities/UtilityFunctions'
import { useFilterStore } from '../utilities/FilterStore';

// TODO - Add breakpoints for smaller windows
// TODO - Stop animation when clicked

export default function TimelineSlider({ onValueChange}) {
    let anim;
    const [playAnimation, setPlayAnimation] = useState(false)

    const { yearType, timelineStart, timelineEnd, timelineYear, setTimelineYear } = useFilterStore(
        useShallow((state) => ({ 
            yearType: state.yearType, 
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
            timelineYear: state.timelineYear,
            setTimelineYear: state.setTimelineYear,
        })),
    )

    let min = timelineStart == null || typeof timelineStart == 'string'  ? 0 : timelineStart;
    let max = timelineEnd == null || typeof timelineEnd == 'string' ? 2100 : timelineEnd;

    // Reset start and label
    useEffect(() => {
        setTimelineYear(min)
      }, [min]);

    const handleChange = (event, newValue) => {
        setTimelineYear(newValue)
        onValueChange(newValue)
    }

    const playAnim = () => {
        setPlayAnimation(true)
    }

    useEffect(() => {
        // TODO: Change rate of animation?
        //    - through filters?
        if (playAnimation) {
            let i = timelineYear; // start wherever it is
            anim = setInterval(() => {
                if (timelineYear == max) {
                    i = min;
                    setTimelineYear(min);
                    onValueChange(min);
                } else {
                    onValueChange(i);
                    setTimelineYear(i);
                    i += 10
                }
            }, 500)
        }
        return () => clearTimeout(anim)
    }, [playAnimation])

    return (
        <>
            <Box style={{ backgroundColor: '#ffffff', paddingTop: '20px', paddingLeft: '40px' }}>
                <Box sx={{ marginBottom: '5px' }}> Timeline - {convertYearTypetoView(yearType)} </Box>
                <Box sx={{ display: 'flex', alignContent: 'center' }}>
                    <Button variant='outlined' sx={{ marginRight: '10px' }} onClick={playAnim}> Play </Button>
                    <Button variant='outlined' sx={{ marginRight: '30px' }} onClick={() => setPlayAnimation(false)}> Stop </Button>
                    <Slider
                        min={min}
                        max={max}
                        value={timelineYear}
                        aria-label={`timeline-${yearType} year`}
                        onChange={handleChange}
                        sx={{ width: '500px'}}
                    />
                    <Box style={{ paddingLeft: '30px'}}>
                        Year: {timelineYear}
                    </Box>
                </Box>
            </Box>
        </>
    );
}