import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { locationSchema } from '../utilities/AddLocationSchema.js';
import { 
  Button, 
  InputLabel, 
  Grid2, 
  CircularProgress, 
  Stack, 
  TextField, 
  Typography,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NumberTextField from './NumberTextField.jsx'
import { useMapStore } from '../utilities/MapStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import { findNewFloat } from '../utilities/UtilityFunctions.js';
import { supabase } from '../supabaseClient';
import '../css/Form.css';

let location = {
    type: '',
    createdYearStart: '', 
    createdYearEnd: '', 
    discoveredYear: '', 
    longitude: '', 
    latitude: '',
    text: '',
    place: '',
    location: '',
    script: '',
    shelfmark: '',
    firstWord: '',
}

function cleanValues(values, latitudes, longitudes) {
    console.log("values: ", values)
  let data = {}
  data.location_type = values.type
  data.created_year_start = values.createdYearStart;
  data.longitude = values.longitude
  data.fixed_longitude = findNewFloat(longitudes, values.longitude)
  data.latitude = values.latitude
  data.fixed_latitude = findNewFloat(latitudes, values.latitude)
  data.text = values.text || null
  data.place = values.place || null
  data.location = values.location || null
  data.script = values.script || null
  data.shelfmark = values.shelfmark || null
  data.first_word = values.firstWord || null
  return data;
}

export const UpdateForm = ({ latitudes, longitudes }) => {
    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState(false);

    // TODO: set default values / initial values from selected point

    const { updateformSubmitted, selectedPoint } = useMapStore(
        useShallow((state) => ({ 
          updateformSubmitted: state.updateformSubmitted,
          selectedPoint: state.selectedPoint,
        })),
    );

    useEffect(() => {
        console.log("selectedPoint: ", selectedPoint)
    }, [selectedPoint])

    const formik = useFormik({
        initialValues: selectedPoint ? {
            type: selectedPoint.location_type,
            createdYearStart: selectedPoint.created_year_start,
            createdYearEnd: selectedPoint.created_year_end || location.createdYearEnd,
            discoveredYear: selectedPoint.discovered_year || location.discoveredYear,
            longitude: selectedPoint.longitude,
            latitude: selectedPoint.latitude,
            text: selectedPoint.text || location.text,
            place: selectedPoint.place || location.place,
            location: selectedPoint.location || location.location,
            script: selectedPoint.script || location.script,
            shelfmark: selectedPoint.shelfmark || location.shelfmark,
            firstWord: selectedPoint.first_word || location.firstWord,
        } : {
            type: location.type,
            createdYearStart: location.createdYearStart,
            createdYearEnd: location.createdYearEnd,
            discoveredYear: location.discoveredYear,
            longitude: location.longitude,
            latitude: location.latitude,
            text: location.text,
            place: location.place,
            location: location.location,
            script: location.script,
            shelfmark: location.shelfmark,
            firstWord: location.firstWord,
        },
      validationSchema: locationSchema,
      onSubmit: async (values) => {
        setWaiting(true)
        try {
          const data = cleanValues(values, latitudes, longitudes)
            console.log("data: ", data)
          /*const { error } = await supabase
            .from('locations')
            .update(data)
            .eq('id', selectedPoint.id);*/
          
          setWaiting(false)
          //if (error) throw error

          setSuccess(true)
          updateformSubmitted()
        } catch (error) {
          console.error("Form submit error: ", error);
          setWaiting(false)
        }
      },
      onChange: () => { // Does this work?
        setSuccess(false)
      },
      enableReinitialize: true,
    });

    return (
        <>
            { !selectedPoint && <Typography sx={{ paddingBottom: '10px' }}> Click on a point on the map to update it. </Typography> }
            { selectedPoint &&
                <form onSubmit={formik.handleSubmit}>
                    <Grid2 
                        // add sizing per screen size
                    >
                        <Grid2 container sx={{marginBottom: '25px'}} justifyContent="center" >
                        <Grid2 
                            sx={{
                            display: "flex",
                            alignSelf: 'center'
                            }}
                        >
                            <InputLabel
                                sx={{
                                display: "flex",
                                alignSelf: 'center',
                                marginRight: '15px'
                                }}
                                htmlFor="createdYearStart"
                            >
                                Years created*
                            </InputLabel>
                            <NumberTextField
                                required
                                short
                                name="createdYearStart"
                                value={formik.values.createdYearStart}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.createdYearStart && Boolean(formik.errors.createdYearStart)
                                }
                                helperText={formik.touched.createdYearStart && formik.errors.createdYearStart}
                            />
                        </Grid2>
                        <Grid2 
                            sx={{
                            display: "flex",
                            alignSelf: 'center',
                            }}
                            container
                        >
                            <InputLabel 
                            sx={{
                            display: "flex",
                            alignSelf: 'center',
                            marginRight: '15px',
                            marginLeft: '15px'
                            }}
                            htmlFor="createdYearEnd"
                            >
                            to
                            </InputLabel>
                            <NumberTextField
                            required
                            short
                            name="createdYearEnd"
                            value={formik.values.createdYearEnd}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.createdYearEnd && Boolean(formik.errors.createdYearEnd)
                            }
                            helperText={formik.touched.createdYearEnd && formik.errors.createdYearEnd}
                            />
                        </Grid2>
                        </Grid2>
                        <Stack direction="row" spacing={10} justifyContent="center" >
                        <Stack spacing={3} alignItems="flex-end" >
                            <Stack
                                direction="row"
                                justifyContent="right"
                            >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="type"
                            >
                                Type*
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="type"
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.type && Boolean(formik.errors.type)
                                }
                                helperText={formik.touched.type && formik.errors.type}
                            />
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="right"
                            >
                            <InputLabel 
                                sx={{
                                display: "flex",
                                alignSelf: 'center',
                                marginRight: '15px'
                                }}
                                htmlFor="latitude"
                            >
                                Latitude*
                            </InputLabel>
                            <NumberTextField
                                required
                                name="latitude"
                                value={formik.values.latitude}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.latitude && Boolean(formik.errors.latitude)
                                }
                                helperText={formik.touched.latitude && formik.errors.latitude}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="location"
                            >
                                Location
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.location && Boolean(formik.errors.location)
                                }
                                helperText={formik.touched.location && formik.errors.location}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="text"
                            >
                                Text
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="text"
                                name="text"
                                value={formik.values.text}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.text && Boolean(formik.errors.text)
                                }
                                helperText={formik.touched.text && formik.errors.text}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="firstWord"
                            >
                                First word
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="firstWord"
                                name="firstWord"
                                value={formik.values.firstWord}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.firstWord && Boolean(formik.errors.firstWord)
                                }
                                helperText={formik.touched.firstWord && formik.errors.firstWord}
                            />
                            </Stack>
                    </Stack>
                    <Stack spacing={3} >
                    <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="discoveredYear"
                            >
                                Discovered Year
                            </InputLabel>
                            <NumberTextField
                                required
                                name="discoveredYear"
                                value={formik.values.discoveredYear}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.discoveredYear && Boolean(formik.errors.discoveredYear)
                                }
                                helperText={formik.touched.discoveredYear && formik.errors.discoveredYear}
                            />
                        </Stack>
                        
                        <Stack
                                direction="row"
                                justifyContent="right"
                            >
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="longitude"
                                >
                                Longitude*
                            </InputLabel>
                            <NumberTextField
                                required
                                name="longitude"
                                value={formik.values.longitude}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.longitude && Boolean(formik.errors.longitude)
                                }
                                helperText={formik.touched.longitude && formik.errors.longitude}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="place"
                            >
                                Place
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="place"
                                name="place"
                                value={formik.values.place}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.place && Boolean(formik.errors.place)
                                }
                                helperText={formik.touched.place && formik.errors.place}
                            />
                        </Stack>
                        
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="script"
                            >
                                Script
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="script"
                                name="script"
                                //sx={{ width: '6em' }}
                                value={formik.values.script}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.script && Boolean(formik.errors.script)
                                }
                                helperText={formik.touched.script && formik.errors.script}
                            />
                        </Stack>
                        <Stack
                            direction="row"
                            justifyContent="right"
                        >
                            <InputLabel sx={{
                                    display: "flex",
                                    alignSelf: 'center',
                                    marginRight: '15px'
                                }}
                                htmlFor="shelfmark"
                            >
                                Shelfmark
                            </InputLabel>
                            <TextField
                                size="small"
                                required
                                id="shelfmark"
                                name="shelfmark"
                                //sx={{ width: '6em' }}
                                value={formik.values.shelfmark}
                                onChange={formik.handleChange}
                                error={
                                formik.touched.shelfmark && Boolean(formik.errors.shelfmark)
                                }
                                helperText={formik.touched.shelfmark && formik.errors.shelfmark}
                            />
                        </Stack>
                        
                        </Stack>
                        </Stack>
                        <Button
                            sx={{ mt: 3 }}
                            type="submit"
                            variant='contained'
                            id="updateButton"
                            name="updateButton"
                            disabled={waiting}
                            onClick={formik.handleSubmit}
                            > { /* order, various messages+symbols */ }
                            {!waiting ? 'Update' : 'Update...'}
                            { waiting ? <CircularProgress /> : '' /* a loading symbol */ }
                            { /* TODO remove success symbol when form changed - switch to react-hook-form? */ }
                            { !waiting && success ? <CheckBoxIcon aria-label="success-checkmark" /> : '' }
                        </Button>
                    </Grid2>
                </form>
            }
        </>
    )
}