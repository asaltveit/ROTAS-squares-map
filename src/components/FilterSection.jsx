import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DropDown from './DropDown';
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';
import { yearTypeOptions } from '../constants'
import { useMapStore } from '../stores/MapStore.js'
import { useFilterStore } from '../stores/FilterStore.js'
import RangeField from './RangeField.jsx'
import { supabase } from '../supabaseClient';


export default function FilterSection() {
    const { locationTypes } = useMapStore(
        useShallow((state) => ({ 
          locationTypes: state.locationTypes,
        })),
      )

    const { 
        scripts,
        texts,
        locs,
        firstWords,
        places,

        setPlaces,
        setFirstWords,
        setScripts,
        setTexts,
        setLocs,

        type,
        script,
        text,
        firstWord,
        place,
        location,
        yearType,

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
            clearFilters: state.clearFilters,

            type: state.filters.location_type,
            script: state.filters.script,
            text: state.filters.text,
            firstWord: state.filters.first_word,
            place: state.filters.place,
            location: state.filters.location,
            yearType: state.yearType,
        })),
    )

    async function getTexts() {
        const { data, error } = await supabase.rpc('get_distinct_text');
        if (error) {
          console.error("getTexts error: ", error)
        } else {
            setTexts(convertStringsToOptions(data));
        }
    }

    async function getScripts() {
        const { data, error } = await supabase.rpc('get_distinct_script');
        if (error) {
            console.error("getScripts error: ", error)
        } else {
            setScripts(convertStringsToOptions(data));
        }
    }

    async function getLocations() {
        const { data, error } = await supabase.rpc('get_distinct_location');
        if (error) {
            console.error("getLocations error: ", error)
        } else {
            setLocs(convertStringsToOptions(data));
        }
    }

    async function getPlaces() {
        const { data, error } = await supabase.rpc('get_distinct_place');
        if (error) {
            console.error("getPlaces error: ", error)
        } else {
            setPlaces(convertStringsToOptions(data));
        }
    }

    async function getFirstWords() {
        const { data, error } = await supabase.rpc('get_distinct_first_word');
        if (error) {
            console.error("getFirstWords error: ", error)
        } else {
            setFirstWords(convertStringsToOptions(data));
        }
    }

    useEffect(() => {
        getScripts()
        getLocations()
        getTexts()
        getPlaces()
        getFirstWords()
    }, []);

    const clearAllFilters = () => {
        // Store
        clearFilters()
    }

    return (
        <Box>
            <Grid container direction="row" columnSpacing={3} justifyContent="center">
                <Grid
                    justifyContent="center"
                    size={6}
                    alignItems="center"
                    gap={'10px'}
                > 
                    <Grid>
                        <Typography
                            justifyContent="center"
                        > 
                        Location Filters </Typography>
                    </Grid>
                    <Grid
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid direction="row" container justifyContent="center" columnGap={'20px'} marginTop={'10px'} >
                            {/* TODO: fix - width changes with content, affects column */}
                            <Grid justifyContent="flex-start" container direction="column" rowSpacing={'10px'} >
                                <DropDown ariaLabel="location-type-dropdown" value={type} onValueChange={setTypeFilter} items={convertStringsToOptions(locationTypes)} label="Type" empty ></DropDown>
                                <DropDown ariaLabel="script-dropdown" value={script} onValueChange={setScriptFilter} items={scripts} label="Script" empty ></DropDown>
                                <DropDown ariaLabel="text-dropdown" value={text} onValueChange={setTextFilter} items={texts} label="Text" empty ></DropDown>
                            </Grid>
                            <Grid justifyContent="flex-end" container direction="column" rowSpacing={'10px'} >
                                <DropDown ariaLabel="first-word-dropdown" value={firstWord} onValueChange={setFirstWordFilter} items={firstWords} label="First word" empty ></DropDown>
                                <DropDown ariaLabel="place-dropdown" value={place} onValueChange={setPlaceFilter} items={places} label="Place" empty ></DropDown>
                                <DropDown ariaLabel="location-dropdown" value={location} onValueChange={setLocationFilter} items={locs} label="Location" empty ></DropDown>
                            </Grid>
                        </Grid>
                        
                    </Grid>
                </Grid>
                <Grid 
                    sx={{justifyContent: "flex-end" }}
                    size={4}
                >
                    <Typography> Timeline Filters </Typography>
                    <Grid justifyContent="flex-end" container direction="column" rowSpacing={'10px'} marginTop={'10px'} >
                        <DropDown ariaLabel="year-type-dropdown" value={yearType} onValueChange={setYearType} items={yearTypeOptions} label="Year type" ></DropDown>
                        <InputLabel 
                            sx={{
                            display: "flex",
                            alignSelf: 'center',
                            marginRight: '15px',
                            marginTop: '10px',
                            color: 'black',
                            }}
                            htmlFor="year-range-field"
                        >
                            Year range
                        </InputLabel>
                        <RangeField ariaLabel="year-range-field" ></RangeField>
                    </Grid>
                </Grid>
            </Grid>
            <Button variant='contained' sx={{ marginTop: '30px' }} onClick={clearAllFilters} > Clear All </Button>
        </Box>
    );
}