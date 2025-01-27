import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { locationSchema } from './AddLocationSchema';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { FormLabel, Button } from '@mui/material';
import FormTypeRadioButtonRow from './RadioButtonRow';
import { formTypes } from '../constants/FormConstants';

// TODO - Add options for update location and delete location
// TODO - Add option to add a type

let location = {
    type: '',
    created_year_start: 0,
    created_year_end: 0,
    discovered_year: 0,
    longitude: 0,
    latitude: 0,
    text: '',
    place: '',
    location: '',
    script: '',
    shelfmark: '',
    first_word: '',
}


const Form = () => {
    const [waiting, setWaiting] = useState(false)
    const [formType, setFormType] = useState(formTypes.add)
  
    const formik = useFormik({
      initialValues: {
        type: location.type,
        created_year_start: location.created_year_start,
        created_year_end: location.created_year_end,
        discovered_year: location.discovered_year,
        longitude: location.longitude,
        latitude: location.latitude,
        text: location.text,
        place: location.place,
        location: location.location,
        script: location.script,
        shelfmark: location.shelfmark,
        first_word: location.first_word,
      },
      validationSchema: locationSchema,
      onSubmit: async (values) => {
        setWaiting(true)
        /*const response = await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        })
        const json = await response.json()*/
        setWaiting(false)
        // ... handle response/error
        console.log(values)
      },
      enableReinitialize: true, // what does this do?
    }) // sx={{ mt: 3 }}
  
    return (
      <>
        <Box >
          <FormTypeRadioButtonRow onValueChange={setFormType} />
          {formType === formTypes.add && 
            <form onSubmit={formik.handleSubmit}>
              <TextField
                size="small"
                required
                sx={{ mt: 3 }}
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
                size="small"
                required
                sx={{ mt: 3 }}
                label="To"
                id="createdYearEnd"
                name="createdYearEnd"
                value={formik.values.created_year_end}
                onChange={formik.handleChange}
                error={
                  formik.touched.created_year_end && Boolean(formik.errors.created_year_end)
                }
                helperText={formik.touched.created_year_end && formik.errors.created_year_end}
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
              />
              <TextField
                size="small"
                required
                sx={{ mt: 3 }}
                label="Longitude"
                id="longitude"
                name="longitude"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                error={
                  formik.touched.longitude && Boolean(formik.errors.longitude)
                }
                helperText={formik.touched.longitude && formik.errors.longitude}
                style={{display: 'block'}}
              />
              <TextField
                size="small"
                required
                sx={{ mt: 3 }}
                label="Latitude"
                id="latitude"
                name="latitude"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                error={
                  formik.touched.latitude && Boolean(formik.errors.latitude)
                }
                helperText={formik.touched.latitude && formik.errors.latitude}
                style={{display: 'block'}}
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
                
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
                
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
                
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
                
              />
              <TextField
                size="small"
                required
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
                style={{display: 'block'}}
                
              />
              <Button
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={waiting}
                style={{display: 'block'}}
              >
                {!waiting ? 'Save' : 'Saving...'}
              </Button>
            </form>
          }
          
        </Box>
      </>
    )
  }
  
  export default Form;

  