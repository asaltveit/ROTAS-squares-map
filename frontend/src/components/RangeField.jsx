import { TextField, Stack } from '@mui/material';
import '../css/RangeField.css';

/*
Assumes:
    onValueChange = () => {}, // sets value in parent
    label = string
*/

// TODO height, lineHeight are a bit hacky for centering dash

export default function RangeField({ onValueChangeStart, onValueChangeEnd }) {

    const handleChangeStart = (event) => {
        let val = event.target.value
        if (val == '') {
            onValueChangeStart(0)
        } else {
            onValueChangeStart(parseInt(val))
        }
        
    };

    const handleChangeEnd = (event) => {
        let val = event.target.value;
        if (val == '') {
            onValueChangeEnd(2100)
        } else {
            onValueChangeEnd(parseInt(val))
        } 
    };

    return (
        <Stack direction="row" >
            <TextField variant="outlined" size="small" sx={{width: '5em', marginRight: '1em'}} type="number" label="Start" onBlur={handleChangeStart} />
            <span style={{ height: '2.5em', lineHeight: '2.5em', alignText: 'center', justifyContent: 'center', alignItems: 'center'}}> - </span>
            <TextField sx={{width: '5em', marginRight: '1em', marginLeft: '1em'}} type="number" size="small" label="End" variant="outlined" onBlur={handleChangeEnd} />
        </Stack>
    );
}
