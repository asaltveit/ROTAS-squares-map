import React, {useEffect, useState} from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Slider, Button, Box } from '@mui/material';
import { convertYearTypetoView } from '../utilities/UtilityFunctions'
import { useFilterStore } from '../utilities/FilterStore';

// TODO - Add breakpoints for smaller windows

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

    // Reset start and label
    useEffect(() => {
        setYear(min)
      }, [min]);

    const handleChange = (event, newValue) => {
        setYear(newValue)
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
    // padding: '7px'
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
                        value={year}
                        aria-label={`timeline-${yearType} year`}
                        onChange={handleChange}
                        sx={{ width: '500px'}}
                    />
                    <Box style={{ paddingLeft: '30px'}}>
                        Year: {year}
                    </Box>
                </Box>
            </Box>
        </>
    );
}