import React, {useEffect, useState} from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Scrubber } from 'react-scrubber';
import 'react-scrubber/lib/scrubber.css';
import { convertYearTypetoView } from '../utilities/UtilityFunctions'
import { useFilterStore } from '../utilities/FilterStore';

// TODO - Fix timeline moving when dragged

export default function TimelineSlider({min, max, onValueChange}) {
    let anim;
    const [year, setYear] = useState(0);
    const [playAnimation, setPlayAnimation] = useState(false)

    const { yearType } = useFilterStore(
        useShallow((state) => ({ 
          yearType: state.yearType, 
        })),
    )

    const handleScrubStart = (value) => {
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    const handleScrubEnd = (value) => {
        setPlayAnimation(false)
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    const handleScrubChange = (value) => {
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    const playAnim = () => {
        setPlayAnimation(true)
    }

    useEffect(() => {
        if (playAnimation) {
            let i = min;
            anim = setInterval(() => {
                if (year == max) {
                    i = min;
                    setYear(min);
                    onValueChange(min);
                } else {
                    onValueChange(i);
                    setYear(i++); // year + 1
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
                    <Scrubber
                        min={min}
                        max={max}
                        value={year}
                        onScrubStart={() => handleScrubStart}
                        onScrubEnd={handleScrubEnd}
                        onScrubChange={handleScrubChange}
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