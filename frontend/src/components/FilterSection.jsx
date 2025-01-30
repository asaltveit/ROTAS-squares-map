import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Box, Typography, FormGroup, FormControlLabel, Button, Switch, Grid2 } from '@mui/material';
import DropDown from './DropDown';
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';
import { yearTypeOptions } from '../constants/FilterSection.js'
import { useLocationStore } from '../utilities/LocationStore'


export default function FilterSection() {
    const [locationTypeCheck, setLocationTypeCheck] = useState(false);
    //const [textCheck, setTextCheck] = useState(false);
    const [scriptCheck, setScriptCheck] = useState(false);
    const [firstWordCheck, setFirstWordCheck] = useState(false);
    const [placeCheck, setPlaceCheck] = useState(false);
    const [locationCheck, setLocationCheck] = useState(false);
    const [longitudeTypeCheck, setLongitudeCheck] = useState(false);
    const [latitudeCheck, setLatitudeCheck] = useState(false);
    const [yearTypeCheck, setYearTypeCheck] = useState(false);

    const { 
        types, 
        setTypeFilter,
        setScriptFilter,
        //setTextFilter,
        setFirstWordFilter,
        setPlaceFilter,
        setLocationFilter,
        setLongitudeFilter,
        setLatitudeFilter,
        clearFilters, 
        setYearType,
    } = useLocationStore(
        useShallow((state) => ({ 
            types: state.types, 
            setTypeFilter: state.setTypeFilter,
            setScriptFilter: state.setScriptFilter,
            //setTextFilter: state.setTextFilter,
            setFirstWordFilter: state.setFirstWordFilter,
            setPlaceFilter: state.setPlaceFilter,
            setLocationFilter: state.setLocationFilter,
            setLongitudeFilter: state.setLongitudeFilter,
            setLatitudeFilter: state.setLatitudeFilter,
            clearFilters: state.clearFilters,
            setYearType: state.setYearType,
        })),
    )

    const clearAllFilters = () => {
        clearFilters()
        setLocationTypeCheck(false)
        setScriptCheck(false)
        setFirstWordCheck(false)
        setPlaceCheck(false)
        setLocationCheck(false)
        setLongitudeCheck(false)
        setLatitudeCheck(false)
        setYearTypeCheck(false)
    }

    let typeOptions = convertStringsToOptions(types);

    return (
        
            <Grid2 container direction="row" columnSpacing={3} size={12} justifyContent="center">
                <Grid2
                    justifyContent="center"
                    size={6}
                    alignItems="center"
                > 
                    <Grid2>
                        <Typography
                            justifyContent="center"
                        > 
                        Location Filters </Typography>
                    </Grid2>
                    <Grid2
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid2 direction="row" container justifyContent="center">
                            <Grid2 justifyContent="flex-start">
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={locationTypeCheck} onChange={(event) => setLocationTypeCheck(event.target.checked)} />} label="Type" sx={{ mt: 2.5 }} />
                                    { locationTypeCheck && <DropDown onValueChange={setTypeFilter} items={typeOptions} label="Type" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={scriptCheck} onChange={(event) => setScriptCheck(event.target.checked)} />} label="Script" sx={{ mt: 2.5 }} />
                                    { scriptCheck && <DropDown onValueChange={setScriptFilter} items={typeOptions} label="Script" ></DropDown> }
                                </FormGroup>
                                {/*<FormGroup >
                                    <FormControlLabel control={<Switch checked={textCheck} onChange={(event) => setTextCheck(event.target.checked)} />} label="Text" sx={{ mt: 2.5 }} />
                                    { textCheck && <DropDown onValueChange={setTextFilter} items={typeOptions} label="Text" ></DropDown> }
                                </FormGroup>*/}
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={firstWordCheck} onChange={(event) => setFirstWordCheck(event.target.checked)} />} label="First word" sx={{ mt: 2.5 }} />
                                    { firstWordCheck && <DropDown onValueChange={setFirstWordFilter} items={typeOptions} label="First word" ></DropDown> }
                                </FormGroup>
                            </Grid2>
                            <Grid2 justifyContent="flex-end">
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={placeCheck} onChange={(event) => setPlaceCheck(event.target.checked)} />} label="Place" sx={{ mt: 2.5 }} />
                                    { placeCheck && <DropDown onValueChange={setPlaceFilter} items={typeOptions} label="Place" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={locationCheck} onChange={(event) => setLocationCheck(event.target.checked)} />} label="Location" sx={{ mt: 2.5 }} />
                                    { locationCheck && <DropDown onValueChange={setLocationFilter} items={typeOptions} label="Location" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={longitudeTypeCheck} onChange={(event) => setLongitudeCheck(event.target.checked)} />} label="Longitude" sx={{ mt: 2.5 }} />
                                    { longitudeTypeCheck && <DropDown onValueChange={setLongitudeFilter} items={typeOptions} label="Longitude" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={latitudeCheck} onChange={(event) => setLatitudeCheck(event.target.checked)} />} label="Latitude" sx={{ mt: 2.5 }} />
                                    { latitudeCheck && <DropDown onValueChange={setLatitudeFilter} items={typeOptions} label="Latitude" ></DropDown> }
                                </FormGroup>
                            </Grid2>
                        </Grid2>
                        <Grid2 >
                            <Button onClick={clearAllFilters} > Clear All </Button>
                        </Grid2>
                    </Grid2>
                </Grid2>
                <Grid2 
                    sx={{justifyContent: "flex-end" }}
                    size={4}
                >
                    <Typography> Timeline Filters </Typography>
                    <FormGroup sx={{display: "inline-block" }}>
                        <FormControlLabel control={<Switch checked={yearTypeCheck} onChange={(event) => setYearTypeCheck(event.target.checked)} />} label="Year type" sx={{ mt: 2.5 }} />
                        { yearTypeCheck && <DropDown onValueChange={setYearType} items={yearTypeOptions} label="Year type" ></DropDown> }
                    </FormGroup>
                </Grid2>
            </Grid2>
    );
}