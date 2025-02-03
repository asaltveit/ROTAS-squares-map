import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import '../css/RangeField.css';

/*
Assumes:
    onValueChange = () => {}, // sets value in parent
    label = string
*/

// TODO height, lineHeight are a bit hacky for centering dash

export default function DropDown({ onValueChangeStart, onValueChangeEnd, label='' }) {
  // Is local state needed?
    const [startValue, setStartValue] = useState(null);
    const [endValue, setEndValue] = useState(null);

    const handleChangeStart = (event) => {
        setStartValue(parseInt(event.target.value));
        onValueChangeStart(parseInt(event.target.value));
    };

    const handleChangeEnd = (event) => {
        setEndValue(parseInt(event.target.value));
        onValueChangeEnd(parseInt(event.target.value));
    };

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120, display: "inline-block" }} size="small">
            <InputLabel id="dropdown-select-label">{label}</InputLabel>
            <TextField sx={{width: '5em', marginRight: '1em'}} type="number" size="small" label="Start" variant="outlined" onBlur={handleChangeStart} />
            <span style={{ height: '2.5em', lineHeight: '2.5em', alignText: 'center', justifyContent: 'center', alignItems: 'center'}}> - </span>
            <TextField sx={{width: '5em', marginLeft: '1em'}} type="number" size="small" label="End" variant="outlined" onBlur={handleChangeEnd}/>
        </FormControl>
    );
}