import { useState, useEffect } from 'react';
import { locationSchema } from '../utilities/UpdateLocationSchema.js';
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
import { useMapStore } from '../utilities/MapStore.jsx'
import { useShallow } from 'zustand/react/shallow'
import { findNewFloat, mergeObjects, numberTransform } from '../utilities/UtilityFunctions.js';
import { supabase } from '../supabaseClient';
import '../css/Form.css';
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

function cleanValues(values, latitudes, longitudes) {
  // Should longitude, latitude  be included if their fields change?
  let data = {}
  data.location_type = values.location_type
  data.created_year_start = values.created_year_start;
  data.created_year_end = values.created_year_end || null;
  data.discovered_year = values.discovered_year || null;
  //data.longitude = values.longitude 
  data.fixed_longitude = findNewFloat(longitudes, values.fixed_longitude)
  //data.latitude = values.latitude
  data.fixed_latitude = findNewFloat(latitudes, values.fixed_latitude)
  data.text = values.text || null
  data.place = values.place || null
  data.location = values.location || null
  data.script = values.script || null
  data.shelfmark = values.shelfmark || null
  data.first_word = values.first_word || null
  return data;
}

export const UpdateForm = ({ latitudes, longitudes }) => {
    const [waiting, setWaiting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [location, setLocation] = useState('');

    const { updateformSubmitted, selectedPoint } = useMapStore(
        useShallow((state) => ({ 
          updateformSubmitted: state.updateformSubmitted,
          selectedPoint: state.selectedPoint,
        })),
    );

    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
    } = useForm({
        resolver: yupResolver(locationSchema),
        values: location,
    })

    useEffect(() => {
        setLocation(mergeObjects(selectedPoint))
    }, [selectedPoint])

    useEffect(() => {
        setSuccess(false)
    }, [isDirty])
    
    const onSubmit = async (values) => {
        setWaiting(true)
        try {
            let otherLats = latitudes.filter((lat) => lat == values.latitude)
            let otherLngs = longitudes.filter((lng) => lng == values.longitude)
            const data = cleanValues(values, otherLats, otherLngs)

            // TODO: Add RLS policy for update
            const { error } = await supabase 
                .from('locations')
                .update(data)
                .eq('id', selectedPoint.id); 
            
            setWaiting(false)
            if (error) throw error

            setSuccess(true)
            updateformSubmitted()
        } catch (error) {
            console.error("Form submit error: ", error);
            setWaiting(false)
        }
    }
    // TODO: Are the fields protected from attack? - https://www.reddit.com/r/reactjs/comments/11kiy7k/alternatives_to_dangerouslysetinnerhtml/
    // TODO: Labels are no longer centered horizontally
    // TODO: fixed vs not fixed lat/lng for error messages

    return (
        <>
            { typeof selectedPoint == "string" && <Typography sx={{ paddingBottom: '10px' }}> Click on a point on the map to update it. </Typography> }
            { typeof selectedPoint == "object" &&
                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                    <Grid2 
                        // TODO: add sizing per screen size
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
                                htmlFor="created_year_start"
                            >
                                Years created*
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField 
                                        required
                                        size="small"
                                        sx={{
                                            //width: '6em'
                                        }}
                                        name="created_year_start"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.created_year_start?.message
                                        }
                                        helperText={errors?.created_year_start ? errors?.created_year_start?.message.split(',')[0] : " "}
                                    />
                                }
                                name="created_year_start"
                                control={control}
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
                            htmlFor="created_year_end"
                            >
                            to
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        sx={{
                                            //width: '6em'
                                        }}
                                        name="created_year_end"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={numberTransform(value)}
                                        error={
                                            errors?.created_year_end?.message
                                        }
                                        helperText={errors?.created_year_end ? errors?.created_year_end?.message.split(',')[0] : " "}
                                    />
                                }
                                name="created_year_end"
                                control={control}
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
                                htmlFor="location_type"
                            >
                                Type*
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        required
                                        id="location_type"
                                        name="location_type"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={ errors?.location_type?.message }
                                        helperText={errors?.location_type ? errors?.location_type?.message.split(',')[0] : " "}
                                    />
                                }
                                name="location_type"
                                control={control}
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
                                htmlFor="fixed_latitude"
                            >
                                Latitude*
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        required
                                        size="small"
                                        name="fixed_latitude"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.fixed_latitude?.message
                                        }
                                        helperText={errors?.fixed_latitude ? errors?.fixed_latitude?.message.split(',')[0] : " "}
                                    />
                                }
                                name="fixed_latitude"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="location"
                                        name="location"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.location?.message
                                        }
                                        helperText={errors?.location ? errors?.location?.message : " "}
                                    />
                                }
                                name="location"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="text"
                                        name="text"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.text?.message
                                        }
                                        helperText={errors?.text ? errors?.text?.message : " "}
                                    />
                                }
                                name="text"
                                control={control}
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
                                htmlFor="first_word"
                            >
                                First word
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="first_word"
                                        name="first_word"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.first_word?.message
                                        }
                                        helperText={errors?.first_word ? errors?.first_word?.message : " "}
                                    />
                                }
                                name="first_word"
                                control={control}
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
                                htmlFor="discovered_year"
                            >
                                Discovered Year
                            </InputLabel>
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        name="discovered_year"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={numberTransform(value)}
                                        error={
                                            errors?.discovered_year?.message
                                        }
                                        helperText={errors?.discovered_year ? errors?.discovered_year?.message.split(',')[0] : " "}
                                    />
                                }
                                name="discovered_year"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        required
                                        size="small"
                                        name="fixed_longitude"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.fixed_longitude?.message
                                        }
                                        helperText={errors?.fixed_longitude ? errors?.fixed_longitude?.message.split(',')[0] : " "}
                                    />
                                }
                                name="fixed_longitude"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="place"
                                        name="place"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.place?.message
                                        }
                                        helperText={errors?.place ? errors?.place?.message : " "}
                                    />
                                }
                                name="place"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="script"
                                        name="script"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.script?.message
                                        }
                                        helperText={errors?.script ? errors?.script?.message : " "}
                                    />
                                }
                                name="script"
                                control={control}
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
                            <Controller
                                render={({ field: { onChange, onBlur, value } }) => 
                                    <TextField
                                        size="small"
                                        id="shelfmark"
                                        name="shelfmark"
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        value={value}
                                        error={
                                            errors?.shelfmark?.message
                                        }
                                        helperText={errors?.shelfmark ? errors?.shelfmark?.message : " "}
                                    />
                                }
                                name="shelfmark"
                                control={control}
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
                            > { /* order, various messages+symbols */ }
                            {!waiting ? (success ? 'Updated' : 'Update') : 'Updating...'}
                            { waiting ? <CircularProgress /> : '' /* a loading symbol */ }
                            { !waiting && success ? <CheckBoxIcon aria-label="success-checkmark" /> : '' }
                        </Button>
                    </Grid2>
                </form>
            }
        </>
    )
}