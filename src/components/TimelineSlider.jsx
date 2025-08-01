import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'; // direct imports are faster/smaller
import Slider from '@mui/material/Slider'; 
import Button from '@mui/material/Button'; 
import Grid from '@mui/material/Grid'; 
import { convertYearTypetoView } from '../utilities/UtilityFunctions'
import { useFilterStore } from '../stores/FilterStore';
import { useMapStore} from '../stores/MapStore'

// TODO - Add breakpoints for smaller windows
// TODO - Stop animation when slider clicked
// TODO - make it look more like a timeline - ticks

export default function TimelineSlider({ onValueChange}) {
    let anim;
    const [playAnimation, setPlayAnimation] = useState(false)
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(2100)
    const [year, setYear] = useState(0)


    const { yearType, timelineStart, timelineEnd } = useFilterStore(
        useShallow((state) => ({ 
            yearType: state.yearType, 
            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
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

    // Reset start and label
    useEffect(() => {
        setYear(min)
        onValueChange(min)
      }, [min, max]); // Reset timeline to beginning when start or end is changed

    const handleChange = (event, newValue) => {
        setYear(newValue)
        onValueChange(newValue)
    }

    const playAnim = () => {
        setPlayAnimation(!playAnimation)
    }

    //setStorePlayAnimation(playAnim)

    useEffect(() => {
        // TODO: Change rate of animation?
        //    - through filters?
        if (playAnimation) {
            let i = year; // start wherever it is
            anim = setInterval(() => {
                // If it hits the max, should've restarted
                if (year == max) {
                    i = min;
                    setYear(min);
                    onValueChange(min);
                } else {
                    onValueChange(i);
                    setYear(i);
                    i += 10
                }
            }, 500)
        }
        return () => clearTimeout(anim)
    }, [playAnimation])
    return (
        <>
            <Box >
                <Box 
                    aria-label="timeline type" 
                    sx={{ 
                        marginBottom: '5px', 
                    }}
                > Timeline - {convertYearTypetoView(yearType)} </Box>
                <Grid 
                    container
                    spacing={3}
                    sx={{ 
                        marginLeft: '40px'
                    }}
                >
                    <Button 
                        aria-label="play/stop button" 
                        variant='contained'
                        size="small"
                        onClick={playAnim}
                    > { !playAnimation ? "Play" : "Stop"} </Button>
                    <Slider
                        min={min}
                        max={max}
                        value={year}
                        aria-label={`timeline-${yearType} year slider`}
                        onChange={handleChange}
                        sx={{ width: '0.5'}}
                    />
                    <Box >
                        Year: {year}
                    </Box>
                </Grid>
            </Box>
        </>
    );
}