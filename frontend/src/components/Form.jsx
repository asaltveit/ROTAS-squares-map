import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { locationSchema } from '../utilities/AddLocationSchema.js';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { FormLabel, Button, Grid2, Typography, FormControl, Input, FormHelperText, Container, CircularProgress } from '@mui/material';
import DropDown from './DropDown';
import FormTypeRadioButtonRow from './RadioButtonRow';
import { formTypes } from '../constants/FormConstants';
import { useMapStore } from '../utilities/MapStore.jsx'
import { useFilterStore } from '../utilities/FilterStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import { convertStringsToOptions } from '../utilities/UtilityFunctions.js';
import '../css/Form.css';

// TODO - Add options for update location and delete location
// TODO - created start, created end, and discovered year don't accept input

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
/*
If someone clicks submit multiple times, it'll create multiple?

*/

const Form = () => {
    const [waiting, setWaiting] = useState(false);
    const [formType, setFormType] = useState(formTypes.add);

    const { locationTypes, setLocationTypes, updateformSubmitted, formSubmitted } = useMapStore(
      useShallow((state) => ({ 
        locationTypes: state.locationTypes, 
        setLocationTypes: state.setLocationTypes, 
        updateformSubmitted: state.updateformSubmitted,
        formSubmitted: state.formSubmitted,
      })),
    )

    /*const { optionTypes, setOptionTypes } = useFilterStore(
      useShallow((state) => ({ 
        optionTypes: state.optionTypes, 
        setOptionTypes: state.setOptionTypes,
      })),
    )*/

    // TODO - only use this once?
    /*useEffect(() => {
      axios.get('http://localhost:3000/locations/types').then((data) => {
        setOptionTypes(convertStringsToOptions(data.data));
      })
    }, [formSubmitted]);*/
    
    const formik = useFormik({
      initialValues: {
        type: location.type,
        createdYearStart: location.createdYearStart, // camel case worked
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
        axios.post('http://localhost:3000/locations', values).then((res) => {
          console.log("port res: ", res)
        }).catch((e) => {
          console.log("post error: ", e)
        })
        
        setWaiting(false)
        updateformSubmitted()
        // ... handle response/error
      },
      enableReinitialize: true,
    });
    
    
    return (
      <>
        <Box >
          <FormTypeRadioButtonRow onValueChange={setFormType} />
          <Container>
            {formType === formTypes.add && 
              <form onSubmit={formik.handleSubmit}>
                <Grid2 
                  container 
                  spacing={2}
                >
                  <Grid2 
                    sx={{
                      display: "flex",
                      alignSelf: 'center'
                    }}
                    container
                    size={3}
                  >
                    <InputLabel sx={{
                          display: "flex",
                          alignSelf: 'center',
                          marginRight: '15px'
                        }}>
                      Type
                    </InputLabel>
                    <TextField
                      size="small"
                      required
                      id="type"
                      name="type"
                      sx={{ width: '6em' }}
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.type && Boolean(formik.errors.type)
                      }
                      helperText={formik.touched.type && formik.errors.type}
                    />
                  </Grid2>
                  <Grid2 
                    sx={{
                      display: "flex",
                      alignSelf: 'center'
                    }}
                    container
                  >
                    <InputLabel
                        sx={{
                          display: "flex",
                          alignSelf: 'center',
                          marginRight: '15px'
                        }}
                      >
                        Longitude
                    </InputLabel>
                    <TextField
                      size="small"
                      required
                      type="number"
                      id="longitude"
                      name="longitude"
                      sx={{ width: '6em' }}
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.longitude && Boolean(formik.errors.longitude)
                      }
                      helperText={formik.touched.longitude && formik.errors.longitude}
                    />
                  </Grid2>
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
                    >
                      Latitude
                    </InputLabel>
                    <TextField
                      size="small"
                      required
                      type="number"
                      id="latitude"
                      name="latitude"
                      value={formik.values.latitude}
                      onChange={formik.handleChange}
                      sx={{ width: '6em' }}
                      error={
                        formik.touched.latitude && Boolean(formik.errors.latitude)
                      }
                      helperText={formik.touched.latitude && formik.errors.latitude}
                    />
                  </Grid2>
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
                      >
                        Created year
                    </InputLabel>
                    <TextField
                      size="small"
                      required
                      type="number"
                      id="createdYearStart"
                      name="createdYearStart"
                      sx={{ width: '6em' }}
                      value={formik.values.createdYearStart}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.createdYearStart && Boolean(formik.errors.createdYearStart)
                      }
                      helperText={formik.touched.createdYearStart && formik.errors.createdYearStart}
                    />
                  </Grid2>
                </Grid2>
                <Button
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="outlined"
                  id="saveButton"
                  name="saveButton"
                  disabled={waiting}
                  onClick={formik.handleSubmit}
                >
                  {!waiting ? 'Save' : 'Saving...'}
                  { waiting ? <CircularProgress /> : '' /* trying a loading symbol */}
                </Button>
              </form>
            }
          </Container>
        </Box>
      </>
    )
  }
  
  export default Form;

  /*
  {/*<Grid2>
                    <InputLabel
                      sx={{
                        //display: "flex",
                        //alignSelf: "center",//'flex-end',
                        //mt: 3
                        //justifyContent: "center",
                        //alignItems: 'flex-end'//"center",
                        //fontWeight: 700,
                      }}
                    >
                      Years created
                    </InputLabel>
                  </Grid2>
                  <Grid2 container>
                    <TextField
                      variant="standard"
                      size="small"
                      required
                      //sx={{ mt: 3 }}
                      //className="number-field"
                      label="From"
                      id="createdYearStart"
                      name="createdYearStart"
                      value={formik.values.created_year_start}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.created_year_start && Boolean(formik.errors.created_year_start)
                      }
                      helperText={formik.touched.created_year_start && formik.errors.created_year_start}
                    />
                    <TextField
                      variant="standard"
                      size="small"
                      //sx={{ mt: 3 }}
                      label="To"
                      id="createdYearEnd"
                      name="createdYearEnd"
                      value={formik.values.created_year_end}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.created_year_end && Boolean(formik.errors.created_year_end)
                      }
                      helperText={formik.touched.created_year_end && formik.errors.created_year_end}
                      //className="number-field"
                    />
                  </Grid2>
  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      
                    }}
                  >
                    Longitude
                  </InputLabel>
                  <Grid2>
                    <TextField
                      size="small"
                      variant="standard"
                      required
                      //sx={{ mt: 3 }}
                      label="Longitude"
                      id="longitude"
                      name="longitude"
                      value={formik.values.longitude}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.longitude && Boolean(formik.errors.longitude)
                      }
                      helperText={formik.touched.longitude && formik.errors.longitude}
                      className="left-couplet number-field"
                    />
                  </Grid2>
                  <Grid2>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      
                    }}
                  >
                    Latitude
                  </InputLabel>
                  <TextField
                    size="small"
                    required
                    //sx={{ mt: 3 }}
                    label="Latitude"
                    id="latitude"
                    name="latitude"
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.latitude && Boolean(formik.errors.latitude)
                    }
                    helperText={formik.touched.latitude && formik.errors.latitude}
                    className="number-field"
                  />
  <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      
                    }}
                  >
                    Discovered year
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Discovered year"
                    id="discoveredYear"
                    name="discoveredYear"
                    value={formik.values.discovered_year}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.discovered_year && Boolean(formik.errors.discovered_year)
                    }
                    helperText={formik.touched.discovered_year && formik.errors.discovered_year}
                  />
                </Grid2>
                <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Location
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Location"
                    id="location"
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.location && Boolean(formik.errors.location)
                    }
                    helperText={formik.touched.location && formik.errors.location}
                  />
                </Grid2>
                <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Place
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Place"
                    id="place"
                    name="place"
                    value={formik.values.place}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.place && Boolean(formik.errors.place)
                    }
                    helperText={formik.touched.place && formik.errors.place}
                  />
                </Grid2>
                <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Shelfmark
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Shelfmark"
                    id="shelfmark"
                    name="shelfmark"
                    value={formik.values.shelfmark}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.shelfmark && Boolean(formik.errors.shelfmark)
                    }
                    helperText={formik.touched.shelfmark && formik.errors.shelfmark}
                  />
                </Grid2>
                <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Script
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Script"
                    id="script"
                    name="script"
                    value={formik.values.script}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.script && Boolean(formik.errors.script)
                    }
                    helperText={formik.touched.script && formik.errors.script}
                  />
                </Grid2>
                <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Text
                  </InputLabel>
                </Grid2>
                <Grid2 xs={12} sm={10}>
                  <TextField
                    size="small"
                    sx={{ mt: 3 }}
                    label="Text"
                    id="text"
                    name="text"
                    value={formik.values.text}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.text && Boolean(formik.errors.text)
                    }
                    helperText={formik.touched.text && formik.errors.text}
                  />
                </Grid2>
  <Grid2 xs={12} sm={2} sx={{ alignContent: "center" }}>
                  <InputLabel
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    First word
                  </InputLabel>
                </Grid2>
  <Grid2 xs={12} sm={10}>
    <TextField
      size="small"
      sx={{ mt: 3 }}
      label="First word"
      id="first_word"
      name="first_word"
      value={formik.values.first_word}
      onChange={formik.handleChange}
      error={
        formik.touched.first_word && Boolean(formik.errors.first_word)
      }
      helperText={formik.touched.first_word && formik.errors.first_word}
    />
  </Grid2>

  */

  