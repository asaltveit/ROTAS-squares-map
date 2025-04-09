import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Box, Typography, FormGroup, FormControlLabel, Button, Switch, Grid2 } from '@mui/material';
import DropDown from './DropDown';
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';
import { yearTypeOptions } from '../constants/FilterSection.js'
import { useMapStore } from '../utilities/MapStore.jsx'
import { useFilterStore } from '../utilities/FilterStore.jsx'
import RangeField from './RangeField.jsx'
import { supabase } from '../supabaseClient';


export default function FilterSection() {
    const [locationTypeCheck, setLocationTypeCheck] = useState(false);
    const [textCheck, setTextCheck] = useState(false);
    // Assume 2 scripts, have option to add like type?
    const [scriptCheck, setScriptCheck] = useState(false);
    const [firstWordCheck, setFirstWordCheck] = useState(false);
    const [placeCheck, setPlaceCheck] = useState(false);
    const [locationCheck, setLocationCheck] = useState(false);
    const [yearTypeCheck, setYearTypeCheck] = useState(false);
    const [yearRangeCheck, setYearRangeCheck] = useState(false);

    const { formSubmitted, locationTypes } = useMapStore(
        useShallow((state) => ({ 
          formSubmitted: state.formSubmitted,
          locationTypes: state.locationTypes,
        })),
      )

    const { 
        scripts,
        texts,
        locs,
        firstWords,
        places,
        timelineStart,
        timelineEnd,

        setPlaces,
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
        setTimelineStart,
        setTimelineEnd,
        clearFilters, 
    } = useFilterStore(
        useShallow((state) => ({ 
            scripts: state.scripts,
            texts: state.texts,
            locs: state.locs,
            firstWords: state.firstWords,
            places: state.places,

            setPlaces: state.setPlaces,
            setFirstWords: state.setFirstWords,
            setScripts: state.setScripts,
            setTexts: state.setTexts,
            setLocs: state.setLocs,

            setTypeFilter: state.setTypeFilter,
            setScriptFilter: state.setScriptFilter,
            setTextFilter: state.setTextFilter,
            setFirstWordFilter: state.setFirstWordFilter,
            setPlaceFilter: state.setPlaceFilter,
            setLocationFilter: state.setLocationFilter,
            setYearType: state.setYearType,
            setTimelineStart: state.setTimelineStart,
            setTimelineEnd: state.setTimelineEnd,
            clearFilters: state.clearFilters,
        })),
    )

    async function getTexts() {
        const { data, error } = await supabase.rpc('get_distinct_text');
        if (error) {
          console.log("getTexts error: ", error)
        }
        setTexts(convertStringsToOptions(data));
    }

    async function getScripts() {
        const { data, error } = await supabase.rpc('get_distinct_script');
        if (error) {
            console.log("getScripts error: ", error)
        }
        setScripts(convertStringsToOptions(data));
    }

    async function getLocations() {
        const { data, error } = await supabase.rpc('get_distinct_location');
        if (error) {
            console.log("getLocations error: ", error)
        }
        setLocs(convertStringsToOptions(data));
    }

    async function getPlaces() {
        const { data, error } = await supabase.rpc('get_distinct_place');
        if (error) {
            console.log("getPlaces error: ", error)
        }
        setPlaces(convertStringsToOptions(data));
    }

    async function getFirstWords() {
        const { data, error } = await supabase.rpc('get_distinct_first_word');
        if (error) {
            console.log("getFirstWords error: ", error)
        }
        setFirstWords(convertStringsToOptions(data));
    }

    useEffect(() => {
        getScripts()
        getLocations()
        getTexts()
        getPlaces()
        getFirstWords()
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
        setTimelineStart(0)
        setTimelineEnd(2100)
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
                                    <FormControlLabel control={<Switch aria-label="location-type-switch" checked={locationTypeCheck} onChange={(event) => { setTypeFilter(null); setLocationTypeCheck(event.target.checked)}} />} label="Type" sx={{ mt: 2.5 }} />
                                    { locationTypeCheck && <DropDown aria-label="location-type-dropdown" onValueChange={setTypeFilter} items={convertStringsToOptions(locationTypes)} label="Type" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch aria-label="script-switch" checked={scriptCheck} onChange={(event) => { setScriptFilter(null); setScriptCheck(event.target.checked)}} />} label="Script" sx={{ mt: 2.5 }} />
                                    { scriptCheck && <DropDown aria-label="script-dropdown" onValueChange={setScriptFilter} items={scripts} label="Script" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch aria-label="text-switch" checked={textCheck} onChange={(event) => { setTextFilter(null); setTextCheck(event.target.checked)}} />} label="Text" sx={{ mt: 2.5 }} />
                                    { textCheck && <DropDown aria-label="text-dropdown" onValueChange={setTextFilter} items={texts} label="Text" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch aria-label="first-word-switch" checked={firstWordCheck} onChange={(event) => { setFirstWordFilter(null); setFirstWordCheck(event.target.checked)}} />} label="First word" sx={{ mt: 2.5 }} />
                                    { firstWordCheck && <DropDown aria-label="first-word-dropdown" onValueChange={setFirstWordFilter} items={firstWords} label="First word" ></DropDown> }
                                </FormGroup>
                            </Grid2>
                            <Grid2 justifyContent="flex-end">
                                <FormGroup >
                                    <FormControlLabel control={<Switch aria-label="place-switch" checked={placeCheck} onChange={(event) => { setPlaceFilter(null); setPlaceCheck(event.target.checked)}} />} label="Place" sx={{ mt: 2.5 }} />
                                    { placeCheck && <DropDown aria-label="place-dropdown" onValueChange={setPlaceFilter} items={places} label="Place" ></DropDown> }
                                </FormGroup>
                                <FormGroup >
                                    <FormControlLabel control={<Switch aria-label="location-switch" checked={locationCheck} onChange={(event) => { setLocationFilter(null); setLocationCheck(event.target.checked)}} />} label="Location" sx={{ mt: 2.5 }} />
                                    { locationCheck && <DropDown aria-label="location-dropdown" onValueChange={setLocationFilter} items={locs} label="Location" ></DropDown> /* something wrong when selecting long text? */}
                                </FormGroup>
                            </Grid2>
                        </Grid2>
                        
                    </Grid2>
                </Grid2>
                {/* remove until these filters are working
                <Grid2 
                    sx={{justifyContent: "flex-end" }}
                    size={4}
                >
                    <Typography> Timeline Filters </Typography>
                    <FormGroup sx={{display: "inline-block" }}>
                        <FormControlLabel control={<Switch aria-label="year-type-switch" checked={yearTypeCheck} onChange={(event) => { setYearTypeCheck(event.target.checked) }} />} label="Year type" sx={{ mt: 2.5 }} />
                        { yearTypeCheck && <DropDown aria-label="year-type-dropdown" onValueChange={setYearType} items={yearTypeOptions} label="Year type" ></DropDown> }
                    </FormGroup>
                    <FormGroup sx={{display: "inline-block" }}>
                        <FormControlLabel control={<Switch aria-label="year-range-switch" checked={yearRangeCheck} onChange={(event) => { setYearRangeCheck(event.target.checked) }} />} label="Year range" sx={{ mt: 2.5 }} />
                        { yearRangeCheck && <RangeField aria-label="year-range-field" onValueChangeStart={setTimelineStart} onValueChangeEnd={setTimelineEnd} valueStart={timelineStart} valueEnd={timelineEnd}  ></RangeField> }
                    </FormGroup>
                </Grid2>*/}
            </Grid2>
            <Button variant='outlined' onClick={clearAllFilters} > Clear All </Button>
        </Box>
    );
}