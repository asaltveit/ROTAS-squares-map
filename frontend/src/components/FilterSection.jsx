import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Box, Typography, FormGroup, FormControlLabel, Button, Switch, Grid2 } from '@mui/material';
import DropDown from './DropDown';
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';
import { yearTypeOptions } from '../constants/FilterSection.js'
import { useMapStore } from '../utilities/MapStore.jsx'
import { useFilterStore } from '../utilities/FilterStore.jsx'
import axios from 'axios';


export default function FilterSection() {
    const [locationTypeCheck, setLocationTypeCheck] = useState(false);
    const [textCheck, setTextCheck] = useState(false);
    // Assume 2 scripts, have option to add like type?
    const [scriptCheck, setScriptCheck] = useState(false);
    const [firstWordCheck, setFirstWordCheck] = useState(false);
    const [placeCheck, setPlaceCheck] = useState(false);
    const [locationCheck, setLocationCheck] = useState(false);
    const [yearTypeCheck, setYearTypeCheck] = useState(false);

    const { updateformSubmitted, formSubmitted } = useMapStore(
        useShallow((state) => ({ 
          updateformSubmitted: state.updateformSubmitted,
          formSubmitted: state.formSubmitted,
        })),
      )

    const { 
        optionTypes, // used in form too
        scripts,
        texts,
        locs,
        firstWords,
        places,

        setPlaces,
        setOptionTypes,
        setFirstWords,
        setScripts,
        setTexts,
        setLocs,

        setTypeFilter,
        setScriptFilter,
        setTextFilter,
        setFirstWordFilter,
        setPlaceFilter,
        setLocationFilter,
        setYearType,
        clearFilters, 
    } = useFilterStore(
        useShallow((state) => ({ 
            optionTypes: state.optionTypes, // used in form too
            scripts: state.scripts,
            texts: state.texts,
            locs: state.locs,
            firstWords: state.firstWords,
            places: state.places,

            setPlaces: state.setPlaces,
            setOptionTypes: state.setOptionTypes,
            setFirstWords: state.setFirstWords,
            setScripts: state.setScripts,
            setTexts: state.setTexts,
            setLocs: state.setLocs,

            setTypeFilter: state.setTypeFilter,
            setScriptFilter: state.setScriptFilter,
            setTextFilter: state.setTextFilter,
            setFirstWordFilter: state.setFirstWordFilter,
            setPlaceFilter: state.setPlaceFilter,
            setLatitudeFilter: state.setLatitudeFilter,
            setYearType: state.setYearType,
            clearFilters: state.clearFilters,
        })),
    )

    useEffect(() => {
        axios.get('http://localhost:3000/locations/types').then((data) => {
            setOptionTypes(convertStringsToOptions(data.data));
        })
    }, [formSubmitted]);

    useEffect(() => {
        axios.get('http://localhost:3000/locations/scripts').then((data) => {
            setScripts(convertStringsToOptions(data.data))
        })
    }, [formSubmitted]);

    useEffect(() => {
        axios.get('http://localhost:3000/locations/texts').then((data) => {
            setTexts(convertStringsToOptions(data.data))
        })
    }, [formSubmitted]);

    useEffect(() => {
        axios.get('http://localhost:3000/locations/words').then((data) => {
            setFirstWords(convertStringsToOptions(data.data));
        })
    }, [formSubmitted]);

    useEffect(() => {
        axios.get('http://localhost:3000/locations/places').then((data) => {
            setPlaces(convertStringsToOptions(data.data));
        })
    }, [formSubmitted]);

    useEffect(() => {
        axios.get('http://localhost:3000/locations/locations').then((data) => {
            setLocs(convertStringsToOptions(data.data));
        })
    }, [formSubmitted]);

    const clearAllFilters = () => {
        // Store
        clearFilters()
        // Local state
        setLocationTypeCheck(false)
        setScriptCheck(false)
        setFirstWordCheck(false)
        setPlaceCheck(false)
        setLocationCheck(false)
        setYearTypeCheck(false) // do we want this?
        setTextCheck(false)
    }

    const submitSearch = () => {
        console.log("search")
    }


    return (
        <Box>
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
                                    <FormControlLabel control={<Switch checked={locationTypeCheck} onChange={(event) => { setTypeFilter(null); setLocationTypeCheck(event.target.checked)}} />} label="Type" sx={{ mt: 2.5 }} />
                                    { locationTypeCheck && <DropDown onValueChange={setTypeFilter} items={optionTypes} label="Type" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={scriptCheck} onChange={(event) => { setScriptFilter(null); setScriptCheck(event.target.checked)}} />} label="Script" sx={{ mt: 2.5 }} />
                                    { scriptCheck && <DropDown onValueChange={setScriptFilter} items={scripts} label="Script" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={textCheck} onChange={(event) => { setTextFilter(null); setTextCheck(event.target.checked)}} />} label="Text" sx={{ mt: 2.5 }} />
                                    { textCheck && <DropDown onValueChange={setTextFilter} items={texts} label="Text" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={firstWordCheck} onChange={(event) => { setFirstWordFilter(null); setFirstWordCheck(event.target.checked)}} />} label="First word" sx={{ mt: 2.5 }} />
                                    { firstWordCheck && <DropDown onValueChange={setFirstWordFilter} items={firstWords} label="First word" ></DropDown> }
                                </FormGroup>
                            </Grid2>
                            <Grid2 justifyContent="flex-end">
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={placeCheck} onChange={(event) => { setPlaceFilter(null); setPlaceCheck(event.target.checked)}} />} label="Place" sx={{ mt: 2.5 }} />
                                    { placeCheck && <DropDown onValueChange={setPlaceFilter} items={places} label="Place" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch checked={locationCheck} onChange={(event) => { setLocationFilter(null); setLocationCheck(event.target.checked)}} />} label="Location" sx={{ mt: 2.5 }} />
                                    { locationCheck && <DropDown onValueChange={setLocationFilter} items={locs} label="Location" ></DropDown> /* something wrong when selecting long text? */}
                                </FormGroup>
                            </Grid2>
                        </Grid2>
                        
                    </Grid2>
                </Grid2>
                <Grid2 
                    sx={{justifyContent: "flex-end" }}
                    size={4}
                >
                    <Typography> Timeline Filters </Typography>
                    <FormGroup sx={{display: "inline-block" }}>
                        <FormControlLabel control={<Switch checked={yearTypeCheck} onChange={(event) => { setYearType(null); setYearTypeCheck(event.target.checked)}} />} label="Year type" sx={{ mt: 2.5 }} />
                        { yearTypeCheck && <DropDown onValueChange={setYearType} items={yearTypeOptions} label="Year type" ></DropDown> }
                    </FormGroup>
                    
                </Grid2>
            </Grid2>
            <Button onClick={submitSearch} > Submit </Button>
            <Button onClick={clearAllFilters} > Clear All </Button>
        </Box>
    );
}