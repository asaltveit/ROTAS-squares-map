import React, {useEffect, useState} from 'react';
import { Scrubber } from 'react-scrubber';
import 'react-scrubber/lib/scrubber.css';

export default function TimelineSlider({min, max, onValueChange}) {
    let anim;
    const [year, setYear] = useState(0);
    const [playAnimation, setPlayAnimation] = useState(false)

    const handleScrubStart = (value) => {
        setPlayAnimation(false)
        setYear(Math.ceil(value))
        onValueChange(Math.ceil(value))
    }

    const handleScrubEnd = (value) => {
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
            let i = 0;
            anim = setInterval(() => {
                console.log(i)
                if (year == max) {
                    setYear(min);
                    onValueChange(min);
                } else {
                    onValueChange(i);
                    setYear(i++); // year + 1
                }
            }, 100)
        }
    }, [playAnimation])

    // not working
    useEffect(() => {return () => {anim ? clearInterval(anim) : ''}}, [])

    return (
        <>
            <div style={{ float: 'left', padding: '10px', backgroundColor: '#ffffff' }}>
                Timeline
                <div>
                    <button style={{ display: 'inline-block', marginRight: '10px' }} onClick={playAnim}> Play </button>
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