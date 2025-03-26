import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { locationSchema } from '../utilities/AddLocationSchema.js';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { Button, Grid2, Container, CircularProgress, Stack } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FormTypeRadioButtonRow from './RadioButtonRow';
import { formTypes } from '../constants/FormConstants';
import { useMapStore } from '../utilities/MapStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import { findNewFloat } from '../utilities/UtilityFunctions.js';
import '../css/Form.css';

// TODO - Add options for update location and delete location

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
  let data = {}
  data.type = values.type
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
/*
If someone clicks submit multiple times, it'll create multiple?

fields expand if more than 3 chars, except for Type
labels move down if helper text appears
error messages reference the variable instead of viewable name
*/

const Form = () => {
    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formType, setFormType] = useState(formTypes.add);
    const [latitudes, setLatitudes] = useState([]);
    const [longitudes, setLongitudes] = useState([]);

    const { updateformSubmitted } = useMapStore(
      useShallow((state) => ({ 
        updateformSubmitted: state.updateformSubmitted,
      })),
    );

    useEffect(() => {
      axios.get('http://localhost:3000/locations/latitudes').then((data) => {
        setLatitudes(data.data);
      })
    }, [success]);

    useEffect(() => {
      axios.get('http://localhost:3000/locations/longitudes').then((data) => {
        setLongitudes(data.data);
      })
    }, [success]);
    
    const formik = useFormik({
      initialValues: {
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
          const response = await axios.post('http://localhost:3000/locations/', {data: data});
          console.log("response: ", response)
          setWaiting(false)
          setSuccess(true)
          updateformSubmitted()
        } catch (error) {
          console.error("Form submit error: ", error);
          setWaiting(false)
        }
      },
      onChange: () => {
        setSuccess(false)
      },
      enableReinitialize: true,
    });
    // TODO Make font black?
    return (
      <>
        <Box >
          <FormTypeRadioButtonRow onValueChange={setFormType} />
          <Container>
            {formType === formTypes.update && 
              <Box sx={{ color: "black"}}> Coming soon! </Box>
            }
            {formType === formTypes.delete && 
              <Box sx={{ color: "black"}}> Coming soon! </Box>
            }
            {formType === formTypes.add && 
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
                      <TextField
                        size="small"
                        required
                        id="createdYearEnd"
                        name="createdYearEnd"
                        sx={{ width: '6em' }}
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
                          //rowSpacing={2}
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
                          //sx={{ width: '6em' }}
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
                        <TextField
                          size="small"
                          required
                          type="number"
                          id="latitude"
                          name="latitude"
                          value={formik.values.latitude}
                          onChange={formik.handleChange}
                          //sx={{ width: '6em' }}
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
                          //sx={{ width: '6em' }}
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
                          //sx={{ width: '6em' }}
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
                          //sx={{ width: '6em' }}
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
                        <TextField
                          size="small"
                          required
                          id="discoveredYear"
                          name="discoveredYear"
                          //sx={{ width: '6em' }}
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
                        <TextField
                          size="small"
                          required
                          type="number"
                          id="longitude"
                          name="longitude"
                          //sx={{ width: '6em' }}
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
                          //sx={{ width: '6em' }}
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
                    variant="outlined"
                    id="saveButton"
                    name="saveButton"
                    disabled={waiting}
                    onClick={formik.handleSubmit}
                  > { /* order, various messages+symbols */ }
                    {!waiting ? 'Save' : 'Saving...'}
                    { waiting ? <CircularProgress /> : '' /* a loading symbol */ }
                    { /* TODO remove success symbol when form changed */ }
                    { !waiting && success ? <CheckBoxIcon aria-label="success-checkmark" /> : '' }
                  </Button>
                </Grid2>
            
              </form>
            }
          </Container>
        </Box>
      </>
    )
  }
  
  export default Form;
