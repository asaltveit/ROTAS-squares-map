import { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { formTypes } from '../constants/FormConstants';

export default function FormTypeRadioButtonRow({ onValueChange }) {
    const [value, setValue] = useState(formTypes.add)
    const handleChange = (event) => {
        setValue(event.target.value);
        onValueChange(event.target.value);
    }

    return (
        <FormControl>
            <FormLabel id="radio-button-row-label">Form type:</FormLabel>
            <RadioGroup
                row
                aria-labelledby="radio-button-row-label"
                name="radio-button-row-group"
                onChange={handleChange}
                value={value}
            >
            <FormControlLabel value={formTypes.add} control={<Radio />} label="Add" />
            <FormControlLabel value={formTypes.update} control={<Radio />} label="Update" />
            <FormControlLabel value={formTypes.delete} control={<Radio />} label="Delete" />
            </RadioGroup>
        </FormControl>
    );
}