import { TextField, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { useFilterStore } from '../utilities/FilterStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import '../css/RangeField.css';

// TODO height, lineHeight are a bit hacky for centering dash

export default function RangeField() {

    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(2100);

    const { 
        setTimelineStart,
        setTimelineEnd,

        timelineStart,
        timelineEnd,
    } = useFilterStore(
        useShallow((state) => ({ 
            setTimelineStart: state.setTimelineStart,
            setTimelineEnd: state.setTimelineEnd,

            timelineStart: state.timelineStart,
            timelineEnd: state.timelineEnd,
        })),
    )
    
    // Reset
    useEffect(() => {
        if (timelineStart == 0 && timelineEnd == 2100) {
            setStart(0)
            setEnd(2100)
        }
    }, [timelineStart, timelineEnd]);

    const handleChangeStart = (event) => {
        const val = event.target.value;
        setStart(val);
    }

    const handleChangeEnd = (event) => {
        const val = event.target.value;
        setEnd(val);
    }

    const handleBlurStart = (event) => {
        let val = event.target.value;
        if (val == '') {
            setStart(0)
            setTimelineStart(0)
        } else {
            setTimelineStart(parseInt(val))
            setStart(parseInt(val))
        }
    };

    const handleBlurEnd = (event) => {
        let val = event.target.value;
        if (val == '') {
            setEnd(2100)
            setTimelineEnd(2100)
        } else {
            setTimelineEnd(parseInt(val))
            setEnd(parseInt(val))
        }
    };

    return (
        <Stack direction="row" >
            <TextField variant="outlined" size="small" sx={{width: '5em', marginRight: '1em'}} label="Start" value={start} onBlur={handleBlurStart} onChange={handleChangeStart} />
            <span style={{ height: '2.5em', lineHeight: '2.5em', alignText: 'center', justifyContent: 'center', alignItems: 'center'}}> - </span>
            <TextField sx={{width: '5em', marginRight: '1em', marginLeft: '1em'}} size="small" label="End" variant="outlined" value={end} onBlur={handleBlurEnd} onChange={handleChangeEnd} />
        </Stack>
    );
}
