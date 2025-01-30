import { useEffect, useState } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Typography, FormGroup, FormControlLabel, Checkbox, Switch } from '@mui/material';
import DropDown from './DropDown';
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';

/*
Assumes:
    child = {
        header: string,
        body: component
    }
*/

export default function FilterSection({ types }) {
    const [locationType, setLocationType] = useState([false, '']);
    const [yearType, setYearType] = useState([false, '']);
    

    const changeLocationTypeSwitch = (event) => {
        console.log("event.target.value: ", event.target.checked);
        setLocationType(event.target.checked, locationType[1]);
    }

    const changeLocationTypeDropDown = (value) => {
        setLocationType(locationType[0], value);
    }

    const changeYearTypeSwitch = (event) => {
        console.log("event.target.value: ", event.target.checked);
        setYearType(event.target.checked, yearType[1]);
    }

    const changeYearTypeDropDown = (value) => {
        setYearType(yearType[0], value);
    }

    let typeOptions = convertStringsToOptions(types);
    // , justifyContent: "space-between", alignItems: "flex-start"

    return (
        <Box>
            <Box sx={{display: "flex", justifyContent: "left" }}>
                <Typography> Location Filters </Typography>
                <FormGroup sx={{display: "inline-block" }}>
                    <FormControlLabel control={<Switch checked={locationType[0]} onChange={changeLocationTypeSwitch} />} label="Type" sx={{ mt: 2.5 }} />
                    { locationType[0] && <DropDown onValueChange={changeLocationTypeDropDown} items={typeOptions} label="Type" ></DropDown> }
                </FormGroup>
                
            </Box>
            <Box sx={{display: "flex", justifyContent: "left" }}>
                <Typography> Timeline Filters </Typography>
                <FormGroup sx={{display: "inline-block" }}>
                    <FormControlLabel control={<Switch checked={yearType[0]} onChange={changeYearTypeSwitch} />} label="Year type" sx={{ mt: 2.5 }} />
                    { yearType[0] && <DropDown onValueChange={changeYearTypeDropDown} items={typeOptions} label="Year type" ></DropDown> }
                </FormGroup>
            </Box>
            
        </Box>
    );
}